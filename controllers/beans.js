import { Router } from "express"
import { Bean } from "../models/bean.js"
import { body, validationResult } from "express-validator"
import { authenticateToken } from "../middlewares/authenticateToken.js"

const router = Router()

router.get("/", authenticateToken, async (request, response) => {
  const beans = await Bean.find({ isPublished: true })
    .sort({ brand: 1, name: 1 })
    .lean()
  response.render("shared/index", { pageTitle: "All Beans", resources: beans })
})

router.get("/new", authenticateToken, async (request, response) => {
  response.render("shared/new", {
    pageTitle: "Submit Beans For Review",
    resourceType: "Beans",
    url: "/beans",
  })
})

router.get("/:id", authenticateToken, async (request, response) => {
  try {
    const bean = await Bean.findById(request.params.id).exec()
    if (!bean) throw new Error("Beans not found.")

    response.render("beans/show", { bean: bean })
  } catch (error) {
    console.error(error)
    response.status(404).send("Beans could not be found")
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
      const existingBeans = await Bean.findOne({
        brand: request.body.brand,
        name: request.body.name,
      })
        .select(["brand", "name"])
        .lean()

      if (existingBeans) {
        response.send(
          "Beans with this name already exist (if you can't see them, they may be waiting for admin review)"
        )
      } else {
        const bean = new Bean({
          brand: request.body.brand,
          name: request.body.name,
        })
        await bean.save()

        response.render("shared/success")
      }
    } catch (error) {
      console.log(error)
      response.send("These beans failed to be created.")
    }
  }
)

export default router
