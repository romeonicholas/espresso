import { Router } from "express"
import { Bean } from "../models/bean.js"
import { Machine } from "../models/machine.js"
import { Grinder } from "../models/grinder.js"
import { authenticateToken } from "../middlewares/authenticateToken.js"

const router = Router()

router.get("/unpublished", authenticateToken, async (request, response) => {
  if (!response.locals.isAdmin) {
    response.redirect("/")
  }
  try {
    const unpublishedResourceTypes = [Bean, Machine, Grinder]

    const unpublishedResources = await Promise.all(
      unpublishedResourceTypes.map((resourceType) => {
        return resourceType.find({ isPublished: false }).lean().exec()
      })
    )

    response.render("admin/unpublished", {
      unpublishedBeans: unpublishedResources[0],
      unpublishedMachines: unpublishedResources[1],
      unpublishedGrinders: unpublishedResources[2],
    })
  } catch (error) {
    console.error(error)
    response.send("Failed to get unpublished resources")
  }
})

router.post(
  "/unpublished/update",
  authenticateToken,
  async (request, response) => {
    if (!response.locals.isAdmin) {
      response.redirect("/")
    }

    try {
      const resourcesTuples = [
        [Bean, "beans"],
        [Machine, "machines"],
        [Grinder, "grinders"],
      ]

      await Promise.all(
        resourcesTuples.map((resourceTuple) => {
          return resourceTuple[0]
            .updateMany(
              { _id: { $in: request.body[resourceTuple[1]] } },
              { isPublished: true }
            )
            .exec()
        })
      )

      response.redirect("/admin/unpublished")
    } catch (error) {
      console.error(error)
      response.send("Failed to publish resources")
    }
  }
)

router.post(
  "/unpublished/delete",
  authenticateToken,
  async (request, response) => {
    if (!response.locals.isAdmin) {
      response.redirect("/")
    }

    try {
      const resourcesTuples = [
        [Bean, "beans"],
        [Machine, "machines"],
        [Grinder, "grinders"],
      ]

      await Promise.all(
        resourcesTuples.map((resourceTuple) => {
          return resourceTuple[0]
            .deleteMany({ _id: { $in: request.body[resourceTuple[1]] } })
            .exec()
        })
      )

      response.redirect("/admin/unpublished")
    } catch (error) {
      console.error(error)
      response.send("Failed to delete resources")
    }
  }
)

export default router
