import { Router } from 'express'
import { Shot } from '../models/shot.js'
import { body, validationResult } from 'express-validator'
import { authenticateToken } from '../middlewares/authenticateToken.js'


const router = Router()

router.get('/', authenticateToken, async (request, response) => {
    try {
        const shots = await Shot.find({}).exec()
        console.print(request.body)
        response.render('shots/index', { shots: shots })
    } catch(error) {
        console.error(error)
        response.render('shots/index', { shots: [] })
    }
})

router.get('/new', authenticateToken, (request, response) => {
    response.render('shots/new')
})

router.post(
    '/', 
    authenticateToken,
    body('grindsWeightGrams').isInt(),
    body('shotsWeightGrams').isInt(), 
    body('durationSeconds').isInt(), 
    body('comments').isString().isLength({ max: 256 }).trim().escape(),
    async (request, response) => {
        try {
            validationResult(request).throw()

            const shot = new Shot({
                id: Math.floor(Math.random() * 100000),
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
    }
)

router.get('/:id', authenticateToken, async (request, response) => {
    try {
        const shot = await Shot.findOne( { id: request.params.id }).exec()
        if (!shot) throw new Error ('Shot not found.')

        response.render('shots/show', { shot: shot })
    } catch(error) {
        console.error(error)
        response.status(404).send('Shot could not be found')
    }
})

router.get('/:id/edit', authenticateToken, async (request, response) => {
    try {
        const shot = await Shot.findOne( { id: request.params.id } )
        response.render('shots/edit', { shot: shot })
    } catch(error) {
        console.error(error)
        response.status(404).send('Shout could not be found')
    }
})

router.get('/:id/delete', authenticateToken, async (request, response) => {
    try {
        await Shot.findOneAndDelete( { id: request.params.id } )
        response.redirect('/shots')
    } catch(error) {
        console.error(error)
        response.status(404).send('Shout could not be deleted.')
    }
})

router.post('/:id', authenticateToken, async (request, response) => {
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