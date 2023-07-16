import { Router } from "express"
import { Shot } from "../models/shot.js"
import { body, validationResult } from "express-validator"
import { authenticateToken } from "../middlewares/authenticateToken.js"
import { User } from "../models/user.js"

const router = Router()

router.get("/", authenticateToken, async (request, response) => {
  try {
    const shots = await Shot.find({})
      .limit(50)
      .sort({ date: -1 })
      .populate({ path: "user", fields: "username" })
      .lean()
    response.render("shots/index", { shots: shots })
  } catch (error) {
    console.error(error)
    response.render("shots/index", { shots: [] })
  }
})

router.get("/new", authenticateToken, async (request, response) => {
  try {
    const user = await User.findById(response.locals.id)
      .populate("machines")
      .populate("beans")
      .populate("grinders")
      .exec()

    if (!user.machines.length || !user.beans.length || !user.grinders.length) {
      response.redirect("/users/me")
    }

    const shot =
      user.shots.length === 0
        ? {
            bean: { _id: null },
            machine: { _id: null },
            grinder: { _id: null },
            grindsWeightGrams: 0,
            shotsWeightGrams: 0,
            durationSeconds: 0,
          }
        : await Shot.findById(user.shots[user.shots.length - 1])

    console.log(shot)

    response.render("shots/new", {
      pageTitle: "New Shots",
      user: user,
      shot: shot,
    })
  } catch (error) {
    console.error(error)
    response.status(404).send("Could not create new shot")
  }
})

router.post(
  "/",
  authenticateToken,
  body("comments").isString().isLength({ max: 256 }).trim().escape(),
  async (request, response) => {
    try {
      validationResult(request).throw()

      const shot = new Shot({
        grindsWeightGrams: request.body.grindsWeightGrams,
        shotsWeightGrams: request.body.shotsWeightGrams,
        durationSeconds: request.body.durationSeconds,
        user: response.locals.id,
        bean: request.body.beanId,
        beanRoastDate: request.body.roastDate,
        machine: request.body.machineId,
        grinder: request.body.grinderId,
        comments: request.body.comments,
        favorite: request.body.favorite === "true" ? "true" : "false",
        bodyRating: request.body.bodyRating,
        acidityRating: request.body.acidityRating,
        aromaticsRating: request.body.aromaticsRating,
        sweetnessRating: request.body.sweetnessRating,
        aftertasteRating: request.body.aftertasteRating,
      })
      await shot.save()

      const user = await User.findById(response.locals.id).exec()
      user.shots.addToSet(shot)
      await user.save()

      response.redirect(`shots/${shot.id}`)
    } catch (error) {
      console.error(error)
      response.send("This shot failed to be created.")
    }
  }
)

router.get("/:id", authenticateToken, async (request, response) => {
  try {
    const shot = await Shot.findById(request.params.id)
      .populate("bean")
      .populate("machine")
      .populate("grinder")
      .populate("user")
      .lean()

    if (!shot) throw new Error("Shot not found.")

    const isOwner = shot.user._id.equals(response.locals.id)

    response.render("shots/show", {
      pageTitle: "Shot Details",
      shot: shot,
      isOwner: isOwner,
    })
  } catch (error) {
    console.error(error)
    response.status(404).send("Shot could not be found")
  }
})

router.get("/:id/edit", authenticateToken, async (request, response) => {
  try {
    const shot = await Shot.findById(request.params.id)
      .populate("bean")
      .populate("machine")
      .populate("grinder")
      .exec()

    response.render("shots/edit", { pageTitle: "Edit Shot", shot: shot })
  } catch (error) {
    console.error(error)
    response.status(404).send("Shot could not be found")
  }
})

router.get("/:id/delete", authenticateToken, async (request, response) => {
  try {
    const shot = await Shot.findById(request.params.id)
    const user = await User.findById(response.locals.id)

    if (shot.user.equals(response.locals.id) || response.locals.isAdmin) {
      let updatedShotsList = user.shots.filter(
        (shot) => shot._id.toString() !== request.params.id
      )
      await user.set("shots", updatedShotsList).save()
      await shot.deleteOne()

      response.redirect("/users/me")
    } else {
      response.status(403).send("Access denied")
    }
  } catch (error) {
    console.error(error)
    response.status(404).send("Shout could not be deleted.")
  }
})

router.post("/:id", authenticateToken, async (request, response) => {
  try {
    const shot = await Shot.findOneAndUpdate(
      { id: request.params.id },
      request.body,
      { new: true }
    )

    response.redirect(`/shots/${shot.id}`)
  } catch (error) {
    console.error(error)
    response.status(404).send("Shot could not be found")
  }
})

export default router
