import express from 'express'

const app = express()
const PORT = 3000

let shotsPulled = 1

app.get('/', (request, response) => {
    response.send('Welcome to Your Best Shots!')
})

app.get('/dashboard', (request, response) => {
    const IP = request.ip
    response.send(`You\'re reaching out to us from ${IP}`)
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