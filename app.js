import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { PORT } from './config/app.js'
import './config/database.js'

import simpleRoutes from './controllers/simple-pages.js'
import shotsRoutes from './controllers/shots.js'
import machinesRoutes from './controllers/machines.js'
import grindersRoutes from './controllers/grinders.js'
import beansRoutes from './controllers/beans.js'
import usersRoutes from './controllers/users.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.set('view engine', 'ejs')
app.use('/assets', express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('tiny'))
}
app.use(cookieParser())

app.use(simpleRoutes)
app.use('/shots', shotsRoutes)
app.use('/machines', machinesRoutes)
app.use('/grinders', grindersRoutes)
app.use('/beans', beansRoutes)
app.use('/users', usersRoutes)

app.listen(PORT, () => {
    console.log(`👋 Started espresso server on port ${PORT}`)
})