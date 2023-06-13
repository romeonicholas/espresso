import express from 'express'

const app = express()
const PORT = 3000

app.get('/', (request, response) => {
    response.send('Welcome to Your Best Shots!')
})

app.listen(PORT, () => {
    console.log(`👋 Started espresso server on port ${PORT}`)
})