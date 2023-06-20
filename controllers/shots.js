import { Router } from 'express'
import { Shot } from '../models/shot.js'
import { body, validationResult } from 'express-validator'
import { authenticateToken } from '../middlewares/authenticateToken.js'
import { User } from '../models/user.js'


const router = Router()

router.get('/', authenticateToken, async (request, response) => {
    try {
        const shots = await Shot.find({}).exec()
        response.render('shots/index', { shots: shots })
    } catch(error) {
        console.error(error)
        response.render('shots/index', { shots: [] })
    }
})

router.get('/new', authenticateToken, async (request, response) => {
    const user = await User.findById(response.locals.id)
        .populate('machines')
        .populate('beans')
        .populate('grinders').exec()
    response.render('shots/new', { user: user })
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
                grindsWeightGrams: request.body.grindsWeightGrams,
                shotsWeightGrams: request.body.shotsWeightGrams,
                durationSeconds: request.body.durationSeconds,
                user: response.locals.id,
                bean: request.body.beanId,
                machine: request.body.machineId,
                grinder: request.body.grinderId,
                comments: request.body.comments,
                favorite: request.body.favorite.checked
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
        const shot = await Shot.findById(request.params.id).exec()
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