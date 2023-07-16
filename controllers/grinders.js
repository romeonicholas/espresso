import { Router } from "express"
import { Grinder } from "../models/grinder.js"
import { body, validationResult } from "express-validator"
import { authenticateToken } from "../middlewares/authenticateToken.js"

const router = Router()

router.get("/", authenticateToken, async (request, response) => {
  const grinders = await Grinder.find({ isPublished: true })
    .sort({ brand: 1, name: 1 })
    .lean()
  response.render("shared/index", {
    pageTitle: "All Grinders",
    resources: grinders,
  })
})

router.get("/new", authenticateToken, async (request, response) => {
  response.render("grinders/new", { pageTitle: "Submit Grinder" })
})

router.get("/:id", authenticateToken, async (request, response) => {
  try {
    const grinder = await Grinder.findById(request.params.id).exec()
    if (!grinder) throw new Error("Grinder not found.")

    response.render("grinders/show", { grinder: grinder })
  } catch (error) {
    console.error(error)
    response.status(404).send("Grinder could not be found")
  }
})

router.post(
  "/",
  authenticateToken,
  body("brand").isString().isLength({ max: 256 }).trim().escape(),
  body("name").isString().isLength({ max: 256 }).trim().escape(),
  async (request, response) => {
    try {
      validationResult(request).throw()

      const grinder = new Grinder({
        brand: request.body.brand,
        name: request.body.name,
      })
      await grinder.save()

      response.redirect(`grinders/${grinder._id.toString()}`)
    } catch (error) {
      console.log(error)
      response.send("This grinder failed to be created.")
    }
  }
)

export default router
