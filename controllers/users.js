import { Router } from "express"
import { User } from "../models/user.js"
import { Shot } from "../models/shot.js"
import { Bean } from "../models/bean.js"
import { Machine } from "../models/machine.js"
import { Grinder } from "../models/grinder.js"
import { SECRET_JWT_CODE, JWT_EXPIRES_IN } from "../config/app.js"
import { authenticateToken } from "../middlewares/authenticateToken.js"
import { checkLoginStatus } from "../middlewares/checkLoginStatus.js"
import { body, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import JSONWebToken from "jsonwebtoken"

const router = Router()

router.get("/", authenticateToken, (request, response) => {
  response.render("users/")
})

router.get("/new", checkLoginStatus, (request, response) => {
  if (response.locals.username) {
    response.redirect("/users/me")
  } else {
    response.render("users/new", { pageTitle: "Sign Up" })
  }
})

router.get("/me", authenticateToken, async (request, response) => {
  try {
    const user = await User.findById(response.locals.id)
      .populate("machines")
      .populate("beans")
      .populate("grinders")
      .populate({ path: "shots", options: { sort: { date: -1 }, limit: 5 } })
      .exec()
    response.render("users/me", { pageTitle: "Dashboard", user: user })
  } catch (error) {
    console.error(error)
    response.send("An error ocurred while loading the dashboard.")
  }
})

router.get("/me/shots", authenticateToken, async (request, response) => {
  try {
    console.log(response.locals)
    const shots = await Shot.find({ user: response.locals.id }).exec()
    console.log(shots)
    const user = await User.findById(response.locals.id)
      .populate({ path: "shots", options: { sort: { date: -1 } } })
      .exec()
    response.render("users/shots/index", {
      pageTitle: "My Shot History",
      shots: user.shots,
    })
  } catch (error) {
    console.error(error)
    response.send("An error ocurred.")
  }
})

router.get("/me/machines", authenticateToken, async (request, response) => {
  try {
    const user = await User.findById(response.locals.id)
      .populate("machines")
      .exec()
    response.send(user.machines)
  } catch (error) {
    console.error(error)
    response.send("An error ocurred.")
  }
})

router.get(
  "/me/:resourceType/new",
  authenticateToken,
  async (request, response) => {
    // Move route validation to middleware
    // Create object with necessary references in helpers instead of here
    const resourceType = request.params.resourceType.toLowerCase()
    const schemasFromResourceType = {
      beans: Bean,
      machines: Machine,
      grinders: Grinder,
    }
    const schema = schemasFromResourceType[`${resourceType}`]

    try {
      const user = await User.findById(response.locals.id)
      const newResources = await schema
        .find({ isPublished: true, _id: { $nin: user[`${resourceType}`] } })
        .sort({ brand: 1 })
        .lean()

      const resourceMap = new Map()
      newResources.forEach((resource) => {
        if (!resourceMap.has(resource.brand)) {
          resourceMap.set(`${resource.brand}`, [[resource.name, resource._id]])
        } else {
          resourceMap
            .get(`${resource.brand}`)
            .push([resource.name, resource._id])
        }
      })

      const upperCaseResource = resourceType
        .charAt(0)
        .toUpperCase()
        .concat("", resourceType.slice(1))
      response.render("users/shared/new", {
        pageTitle: `Add ${upperCaseResource}`,
        resourceType: upperCaseResource,
        resourceMap: resourceMap,
        url: `/users/me/${resourceType}`,
      })
    } catch (error) {
      console.error(error)
      response.send("An error ocurred.")
    }
  }
)

router.post(
  "/me/:resourceType",
  authenticateToken,
  body("resourceId").isString().isLength({ min: 24, max: 24 }).trim().escape(),
  async (request, response) => {
    try {
      validationResult(request).throw()

      const resourceType = request.params.resourceType.toLowerCase()

      const user = await User.findById(response.locals.id).exec()
      user[`${resourceType}`].addToSet(request.body.resourceId)
      await user.save()

      response.redirect("./")
    } catch (error) {
      console.error(error)
      response.send("Resource failed to be added to your account")
    }
  }
)

router.get(
  "/me/:resource/:id/delete",
  authenticateToken,
  async (request, response) => {
    try {
      const resource = request.params.resource

      if (
        resource !== "beans" &&
        resource !== "machines" &&
        resource !== "grinders"
      ) {
        response.status(404).send("Page not found")
      } else {
        const user = await User.findById(response.locals.id)
        let updatedResource = user[resource].filter(
          (resource) => resource._id.toString() !== request.params.id
        )
        await user.set(resource, updatedResource).save()
        response.redirect("/users/me")
      }
    } catch (error) {
      console.error(error)
      response.send("Resource could not be deleted")
    }
  }
)

router.post(
  "/",
  body("username")
    .custom(async (value) => {
      const usernameRegex = /^[a-zA-Z0-9]{4,16}$/
      if (!usernameRegex.test(value)) {
        throw new Error("Username does not meet requirements.")
      }
    })
    .trim()
    .escape(),
  body("password")
    .custom(async (value) => {
      const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}/
      if (!passwordRegex.test(value)) {
        throw new Error("Password does not meet requirements.")
      }
    })
    .trim()
    .escape(),
  async (request, response) => {
    try {
      validationResult(request).throw()

      let existingUser = await User.findOne({ username: request.body.username })
        .select("username")
        .lean()

      if (existingUser) {
        response.send("Username is already taken, please go back and try again")
      } else {
        bcrypt.hash(request.body.password, 10, async function (err, hash) {
          const user = new User({
            username: request.body.username,
            hashedPassword: hash,
          })
          await user.save()
          const token = JSONWebToken.sign(
            { id: user._id, username: user.username },
            SECRET_JWT_CODE,
            {
              expiresIn: JWT_EXPIRES_IN,
            }
          )

          response
            .cookie("access_token", token, { httpOnly: true })
            .redirect("/users/me")
        })
      }
    } catch (error) {
      console.error(error)
      response.send("User failed to be created")
    }
  }
)

router.get("/login", checkLoginStatus, (request, response) => {
  response.render("users/login", { pageTitle: "Log In" })
})

router.post(
  "/login",
  body("username").isString().trim().escape(),
  body("password").isString().trim().escape(),
  async (request, response) => {
    try {
      const user = await User.findOne({
        username: request.body.username,
      }).exec()
      if (!user) throw new Error("User not found.")

      bcrypt.compare(
        request.body.password,
        user.hashedPassword,
        function (err, result) {
          if (result === true) {
            const token = JSONWebToken.sign(
              { id: user._id, username: user.username, isAdmin: user.isAdmin },
              SECRET_JWT_CODE,
              {
                expiresIn: JWT_EXPIRES_IN,
              }
            )

            response
              .cookie("access_token", token, { httpOnly: true })
              .redirect("/users/me")
          } else {
            response.redirect("/users/login")
          }
        }
      )
    } catch (error) {
      console.error(error)
      response.status(404).send("User could not be found")
    }
  }
)

router.get("/logout", (request, response) => {
  response.clearCookie("access_token").redirect("/")
})

export default router
