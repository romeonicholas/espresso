import rateLimit from "express-rate-limit"

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: async (request, response) => {
    response.render("error/error", {
      errorCode: "429",
      errorMessage:
        "Too many failed attempts to log in, please wait a minute before trying again.",
      pageTitle: "Error",
    })
  },
  standardHeaders: true,
  legacyHeaders: false,
})
