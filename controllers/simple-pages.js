import { Router } from "express"
import { checkLoginStatus } from "../middlewares/checkLoginStatus.js"

const router = Router()

router.get("/", checkLoginStatus, (request, response) => {
  response.render("index", {
    pageTitle: "Home",
  })
})

// router.get("/development", checkLoginStatus, (request, response) => {
//   try {
//     response.render("development", { pageTitle: "In Development" })
//   } catch (error) {
//     console.error(error)
//     response.send("Something went terribly wrong!")
//   }
// })

// router.get("/error", checkLoginStatus, (request, response) => {
//   try {
//     response.render("error/error", {
//       pageTitle: "Error",
//       errorCode: "404",
//       errorMessage: "Something went wrong",
//     })
//   } catch (error) {
//     console.error(error)
//     response.send("Something went terribly wrong!")
//   }
// })

export default router
