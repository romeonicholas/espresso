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
      .exec()
    response.render("shots/index", { shots: shots })
  } catch (error) {
    console.error(error)
    response.send("Could not load shots")
  }
})

router.get("/new", authenticateToken, async (request, response) => {
  try {
    const user = await User.findById(response.locals.id)
      .populate("machines")
      .populate("beans")
      .populate("grinders")
      .lean()
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
            .lean()
            .exec()

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
        user: response.locals.id,
        bean: request.body.beanId,
        machine: request.body.machineId,
        grinder: request.body.grinderId,
        grinderSetting: request.body.grinderSetting,
        grindsWeightGrams: request.body.grindsWeightGrams,
        durationSeconds: request.body.durationSeconds,
        shotsWeightGrams: request.body.shotsWeightGrams,
        bodyRating: request.body.bodyRating,
        acidityRating: request.body.acidityRating,
        aromaticsRating: request.body.aromaticsRating,
        sweetnessRating: request.body.sweetnessRating,
        aftertasteRating: request.body.aftertasteRating,
        comments: request.body.comments,
        // favorite: request.body.favorite === "true" ? "true" : "false",
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
      .exec()

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
      .populate("machine")
      .populate("grinder")
      .lean()
      .exec()

    if (shot.user.equals(response.locals.id) || response.locals.isAdmin) {
      const user = await User.findById(response.locals.id)
        .populate("machines")
        .populate("beans")
        .populate("grinders")
        .lean()
        .exec()

      response.render("shots/edit", { user: user, shot: shot })
    } else {
      response.redirect("/users/me")
    }
  } catch (error) {
    console.error(error)
    response.status(404).send("Shot could not be found")
  }
})

router.post("/:id", authenticateToken, async (request, response) => {
  try {
    const shot = await Shot.findById(request.params.id).exec()

    if (shot.user.equals(response.locals.id) || response.locals.isAdmin) {
      await Shot.replaceOne(
        { _id: shot._id },
        {
          _id: shot._id,
          user: shot.user._id,
          bean: request.body.beanId,
          machine: request.body.machineId,
          grinder: request.body.grinderId,
          grinderSetting: request.body.grinderSetting,
          grindsWeightGrams: request.body.grindsWeightGrams,
          durationSeconds: request.body.durationSeconds,
          shotsWeightGrams: request.body.shotsWeightGrams,
          bodyRating: request.body.bodyRating,
          acidityRating: request.body.acidityRating,
          aromaticsRating: request.body.aromaticsRating,
          sweetnessRating: request.body.sweetnessRating,
          aftertasteRating: request.body.aftertasteRating,
          comments: request.body.comments,
        }
      )

      response.redirect(`/shots/${shot._id}`)
    } else {
      response.redirect("shots/me")
    }
  } catch (error) {
    console.error(error)
    response.send("This shot failed to be created.")
  }
})

router.get("/:id/delete", authenticateToken, async (request, response) => {
  try {
    const [shot, user] = await Promise.all([
      Shot.findById(request.params.id).exec(),
      User.findById(response.locals.id).exec(),
    ])
    // const shot = await Shot.findById(request.params.id).exec()
    // const user = await User.findById(response.locals.id).exec()

    if (shot.user.equals(response.locals.id) || response.locals.isAdmin) {
      let updatedShotsList = user.shots.filter(
        (shot) => shot._id.toString() !== request.params.id
      )
      await Promise.all([
        user.set("shots", updatedShotsList).save(),
        shot.deleteOne(),
      ])

      response.redirect("/users/me")
    } else {
      response.status(403).send("Access denied")
    }
  } catch (error) {
    console.error(error)
    response.status(404).send("Shot could not be deleted.")
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
