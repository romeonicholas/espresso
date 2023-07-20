import { Router } from "express"
import { Shot } from "../models/shot.js"
import { authenticateToken } from "../middlewares/authenticateToken.js"

const router = Router()

router.get("/new", authenticateToken, async (request, response) => {
  response.render("search/new")
})

router.get("/results", authenticateToken, async (request, response) => {
  let results = await Shot.find({
    $text: {
      $search: request.query.terms,
    },
  })
    .populate("machine")
    .populate("bean")
    .populate("grinder")
    .populate("user")

  response.render("search/results", { results: results })
})

export default router
