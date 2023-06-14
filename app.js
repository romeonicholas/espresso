import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = 3000

mongoose.connect('mongodb://127.0.0.1:27017/espresso')
    .then(() => console.log('💽 Database connected'))
    .catch(error => console.error(error))

app.set('view engine', 'ejs')

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('tiny'))
}

const __dirname = dirname(fileURLToPath(import.meta.url))
app.use('/assets', express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))

const shotSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    date: { type: Date, default: Date.now(), required: true },
    beans: { type: String, required: true },
    machine: { type: String, required: true },
    grindsWeight: { type: Number, required: true },
    shotsWeight: { type: Number, required: true },
    comments: { type: String }
})

const Shot = mongoose.model('Shot', shotSchema)

const machineSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    brand: { type: String, required: true },
    name: { type: String, required: true }
})

const Machine = mongoose.model('Machine', machineSchema)

const beanSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    company: { type: String, required: true },
    name: { type: String, required: true },
    roastDate: { type: Date }
})

const Bean = mongoose.model('Bean', beanSchema)

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