import { Router } from "express"
import { checkLoginStatus } from "../middlewares/checkLoginStatus.js"

const router = Router()

router.get("/", checkLoginStatus, (request, response) => {
  try {
    response.render("index", {
      pageTitle: "Home",
    })
  } catch (error) {
    console.error(error)
    response.redirect("/error")
  }
})

router.get("/development", checkLoginStatus, (request, response) => {
  try {
    response.render("development", { pageTitle: "In Development" })
  } catch (error) {
    console.error(error)
    response.send("Something went terribly wrong!")
  }
})

router.get("/error", checkLoginStatus, (request, response) => {
  try {
    response.render("error/error", { pageTitle: "Error" })
  } catch (error) {
    console.error(error)
    response.send("Something went terribly wrong!")
  }
})

export default router
