import express from 'express'
import morgan from 'morgan'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { PORT } from './config/app.js'
import './config/database.js'

import { Shot } from './models/shot.js'
import { Machine } from './models/machine.js'
import { Bean } from './models/bean.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.set('view engine', 'ejs')
app.use('/assets', express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('tiny'))
}

app.get('/', (request, response) => {
    response.render('index')
})

app.get('/shots', async (request, response) => {
    try {
        const shots = await Shot.find({}).exec()
        response.render('shots/index', { shots: shots })
    } catch(error) {
        console.error(error)
        response.render('shots/index', { shots: [] })
    }
})

app.get('/shots/new', (request, response) => {
    response.render('shots/new')
})

app.post('/shots', async (request, response) => {
    try {
        const shot = new Shot({
            id: request.body.id,
            beans: request.body.beans,
            machine: request.body.machine,
            grindsWeight: request.body.grindsWeight,
            shotsWeight: request.body.shotsWeight,
            comments: request.body.comments
        })
        await shot.save()

        response.redirect(`shots/${shot.id}`)
    } catch(error) {
        console.log(error)
        response.send("This shot failed to be created.")
    }
})

app.get('/shots/:id', async (request, response) => {
    try {
        const shot = await Shot.findOne( { id: request.params.id }).exec()
        if (!shot) throw new Error ('Shot not found.')

        response.render('shots/show', { shot: shot })
    } catch(error) {
        console.error(error)
        response.status(404).send('Shot could not be found')
    }
})

app.get('/shots/:id/edit', async (request, response) => {
    try {
        const shot = await Shot.findOne( { id: request.params.id } )
        response.render('shots/edit', { shot: shot })
    } catch(error) {
        console.error(error)
        response.status(404).send('Shout could not be found')
    }
})

app.get('/shots/:id/delete', async (request, response) => {
    try {
        await Shot.findOneAndDelete( { id: request.params.id } )
        response.redirect('/shots')
    } catch(error) {
        console.error(error)
        response.status(404).send('Shout could not be deleted.')
    }
})

app.post('/shots/:id', async (request, response) => {
    try {
        const shot = await Shot.findOneAndUpdate(
            { id: request.params.id },
            request.body,
            { new: true } 
            )
        
        response.redirect(`/shots/${shot.id}`)
    } catch(error) {
        console.error(error)
        response.status(404).send('Shot could not be found')
    }
})

app.get('/machines', (request, response) => {
    // View all machines
})

app.get('/machines/new', (request, response) => {
    // View form to add machine
})

app.post('/machines/new', (request, response) => {
    const newMachine = request.body
    console.log('New machine', newMachine)
    // Send to /machines after posting
})

app.get('/machines/:id', (request, response) => {
    // View specific machine
})

app.all('/logout', (request, response) => {
    const logoutNumber = Math.floor(Math.random() * 50000)
    response.send(`You are logout number ${logoutNumber}`)
})

app.listen(PORT, () => {
    console.log(`👋 Started espresso server on port ${PORT}`)
})