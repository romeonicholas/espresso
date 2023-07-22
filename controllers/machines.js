import { Router } from "express"
import { Machine } from "../models/machine.js"
import { body, validationResult } from "express-validator"
import { authenticateToken } from "../middlewares/authenticateToken.js"

const router = Router()

router.get("/", authenticateToken, async (request, response) => {
  const machines = await Machine.find({ isPublished: true })
    .sort({ brand: 1, name: 1 })
    .lean()
    .exec()
  response.render("shared/index", {
    pageTitle: "All Machines",
    resources: machines,
  })
})

router.get("/new", authenticateToken, (request, response) => {
  response.render("shared/new", {
    pageTitle: "Submit Machine For Review",
    resourceType: "Machine",
    url: "/machines",
  })
})

router.post(
  "/",
  authenticateToken,
  body("brand").isString().isLength({ max: 256 }).trim().escape(),
  body("name").isString().isLength({ max: 256 }).trim().escape(),
  async (request, response) => {
    try {
      validationResult(request).throw()

      const existingMachine = await Machine.findOne({
        brand: request.body.brand,
        name: request.body.name,
      })
        .select(["brand", "name"])
        .lean()
        .exec()

      if (existingMachine) {
        response.send(
          "A machine with this name already exists (if you can't see it, it may be waiting for admin review)"
        )
      } else {
        const machine = new Machine({
          brand: request.body.brand,
          name: request.body.name,
        })
        await machine.save()

        response.render("shared/success", { pageTitle: "Machine Submitted" })
      }
    } catch (error) {
      console.log(error)
      response.send("This machine failed to be created.")
    }
  }
)

// router.get("/:id", authenticateToken, async (request, response) => {
//   try {
//     const machine = await Machine.findById(request.params.id).lean().exec()
//     if (!machine) throw new Error("Machine not found.")

//     response.render("machines/show", { machine: machine })
//   } catch (error) {
//     console.error(error)
//     response.status(404).send("Machine could not be found")
//   }
// })

export default router
