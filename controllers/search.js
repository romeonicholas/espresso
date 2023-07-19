import { Router } from "express"
import { authenticateToken } from "../middlewares/authenticateToken.js"

const router = Router()

router.get("/", authenticateToken, async (request, response) => {
  response.send("here is search!")
})

router.post("/:searchTerms", authenticateToken, async (request, response) => {
  response.send("You searched for: ", request.params.searchTerms)
})

export default router
