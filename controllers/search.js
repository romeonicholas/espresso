import { Router } from "express"
import { Shot } from "../models/shot.js"
import { authenticateToken } from "../middlewares/authenticateToken.js"

const router = Router()

router.get("/new", authenticateToken, (request, response) => {
  response.render("search/new", { pageTitle: "Search" })
})

router.get("/results", authenticateToken, async (request, response) => {
  try {
    let results = await Shot.find({
      $text: {
        $search: request.query.terms,
      },
    })
      .populate("machine")
      .populate("bean")
      .populate("grinder")
      .populate("user")
      .lean()
      .exec()

    response.render("search/results", {
      results: results,
      searchTerms: request.query.terms,
      pageTitle: "Search Results",
    })
  } catch (error) {
    console.error(error)
    response.render("error/error", {
      errorCode: "500",
      errorMessage: "An error ocurred while performing your search.",
      pageTitle: "Error",
    })
  }
})

export default router
