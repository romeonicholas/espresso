import express from "express"
import morgan from "morgan"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import favicon from "serve-favicon"
import path from "path"
import { dirname } from "path"
import { fileURLToPath } from "url"
import mongoSanitize from "express-mongo-sanitize"

import { PORT } from "./config/app.js"
import "./config/database.js"

import simpleRoutes from "./controllers/simple-pages.js"
import shotsRoutes from "./controllers/shots.js"
import machinesRoutes from "./controllers/machines.js"
import grindersRoutes from "./controllers/grinders.js"
import beansRoutes from "./controllers/beans.js"
import usersRoutes from "./controllers/users.js"
import adminRoutes from "./controllers/admin.js"
import searchRoutes from "./controllers/search.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.set("view engine", "ejs")
app.use("/assets", express.static(__dirname + "/public"))
app.use(favicon(path.join(__dirname, "public", "favicon.ico")))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("tiny"))
}
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(helmet())
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req)
    },
  })
)

app.use(simpleRoutes)
app.use("/shots", shotsRoutes)
app.use("/machines", machinesRoutes)
app.use("/grinders", grindersRoutes)
app.use("/beans", beansRoutes)
app.use("/users", usersRoutes)
app.use("/admin", adminRoutes)
app.use("/search", searchRoutes)

app.listen(PORT, () => {
  console.log(`👋 Started espresso server on port ${PORT}`)
})
