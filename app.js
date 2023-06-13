import express from 'express'

const app = express()
const PORT = 3000

app.get('/', (request, response) => {
    response.send('Welcome to Your Best Shots!')
})

app.get('/dashboard', (request, response) => {
    const IP = request.ip
    response.send(`You\'re reaching out to us from ${IP}`)
})

app.get('/newshot', (request, response) => {
    const route = request.route
    response.send(`Where you're going: ${route}`)
})

app.post('/newshot', (request, response) => {
    response.send('Thanks for submitting your new shot! You\'ll see it in your dashboard later!')
})

app.all('/logout', (request, response) => {
    response.send('You\'ve been logged out :(')
})

app.listen(PORT, () => {
    console.log(`👋 Started espresso server on port ${PORT}`)
})