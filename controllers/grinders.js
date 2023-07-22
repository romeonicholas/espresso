import { Router } from "express"
import { Grinder } from "../models/grinder.js"
import { body, validationResult } from "express-validator"
import { authenticateToken } from "../middlewares/authenticateToken.js"

const router = Router()

router.get("/", authenticateToken, async (request, response) => {
  try {
    const grinders = await Grinder.find({ isPublished: true })
      .sort({ brand: 1, name: 1 })
      .lean()
      .exec()
    response.render("shared/index", {
      pageTitle: "All Grinders",
      resources: grinders,
    })
  } catch (error) {
    console.error(error)
    response.render("error/error", {
      errorCode: "500",
      errorMessage: "An error ocurred while retrieving all grinders.",
      pageTitle: "Error",
    })
  }
})

router.get("/new", authenticateToken, (request, response) => {
  response.render("shared/new", {
    pageTitle: "Submit Grinder For Review",
    resourceType: "Grinder",
    url: "/grinders",
  })
})

// router.get("/:id", authenticateToken, async (request, response) => {
//   try {
//     const grinder = await Grinder.findById(request.params.id).lean().exec()
//     if (!grinder) throw new Error("Grinder not found.")

//     response.render("grinders/show", { grinder: grinder })
//   } catch (error) {
//     console.error(error)
//     response.status(404).send("Grinder could not be found")
//   }
// })

router.post(
  "/",
  authenticateToken,
  body("brand").isString().isLength({ max: 256 }).trim().escape(),
  body("name").isString().isLength({ max: 256 }).trim().escape(),
  async (request, response) => {
    try {
      validationResult(request).throw()

      const existingGrinder = await Grinder.findOne({
        brand: request.body.brand,
        name: request.body.name,
      })
        .select(["brand", "name"])
        .lean()
        .exec()

      if (existingGrinder) {
        response.render("error/error", {
          errorCode: "500",
          errorMessage:
            "A grinder with this name already exists (if you can't see it, it may be waiting for admin review)",
          pageTitle: "Error",
        })
      } else {
        const grinder = new Grinder({
          brand: request.body.brand,
          name: request.body.name,
        })
        await grinder.save()

        response.render("shared/success", { pageTitle: "Grinder Submitted" })
      }
    } catch (error) {
      console.error(error)
      response.render("error/error", {
        errorCode: "500",
        errorMessage: "An error ocurred while adding this grinder.",
        pageTitle: "Error",
      })
    }
  }
)

export default router
