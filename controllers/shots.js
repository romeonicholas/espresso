import { Router } from 'express'
import { Shot } from '../models/shot.js'

const router = Router()

router.get('/shots', async (request, response) => {
    try {
        const shots = await Shot.find({}).exec()
        response.render('shots/index', { shots: shots })
    } catch(error) {
        console.error(error)
        response.render('shots/index', { shots: [] })
    }
})

router.get('/shots/new', (request, response) => {
    response.render('shots/new')
})

router.post('/shots', async (request, response) => {
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

router.get('/shots/:id', async (request, response) => {
    try {
        const shot = await Shot.findOne( { id: request.params.id }).exec()
        if (!shot) throw new Error ('Shot not found.')

        response.render('shots/show', { shot: shot })
    } catch(error) {
        console.error(error)
        response.status(404).send('Shot could not be found')
    }
})

router.get('/shots/:id/edit', async (request, response) => {
    try {
        const shot = await Shot.findOne( { id: request.params.id } )
        response.render('shots/edit', { shot: shot })
    } catch(error) {
        console.error(error)
        response.status(404).send('Shout could not be found')
    }
})

router.get('/shots/:id/delete', async (request, response) => {
    try {
        await Shot.findOneAndDelete( { id: request.params.id } )
        response.redirect('/shots')
    } catch(error) {
        console.error(error)
        response.status(404).send('Shout could not be deleted.')
    }
})

router.post('/shots/:id', async (request, response) => {
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

export default router