import express from 'express'
import morgan from 'morgan'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = 3000
app.set('view engine', 'ejs')

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('tiny'))
}

let shotsPulled = 1

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use('/assets', express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (request, response) => {
    response.render('index')
})

app.get('/dashboard', (request, response) => {
    const IP = request.ip
    response.send(`You\'re reaching out to us from ${IP}`)
})

app.get('/shots', (request, response) => {
    response.send('Here\'s where you can see all the new shots coming in.')
})

app.get('/shots/:id', (request, response) => {
    response.send(`This is the page for shot ${request.params.id}`)
})

app.get('/machines', (request, response) => {
    response.send('Here\'s where you can see all of the machines users have added.')
})

app.get('/machines/:id', (request, response) => {
    response.send(`This is the page for machine ${request.params.id}`)
})

app.post('/addmachine', (request, response) => {
    const newMachine = request.body
    console.log('New machine', newMachine)
    response.send(`New machine added! ${newMachine.brand} ${newMachine.name}`)
})

app.get('/beans', (request, response) => {
    response.send('Here\'s where you can see all of the beans users have added.')
})

app.get('/beans/:id', (request, response) => {
    response.send(`This is the page for beans ${request.params.id}`)
})
app.get('/newshot', (request, response) => {
    response.send(`Total shots pulled: ${shotsPulled}`)
})

app.post('/newshot', (request, response) => {
    shotsPulled++
    response.send('Thanks for submitting your new shot! You\'ll see it in your dashboard later!')
})

app.all('/logout', (request, response) => {
    const logoutNumber = Math.floor(Math.random() * 50000)
    response.send(`You are logout number ${logoutNumber}`)
})

app.listen(PORT, () => {
    console.log(`👋 Started espresso server on port ${PORT}`)
})