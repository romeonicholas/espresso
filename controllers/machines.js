import { Router } from 'express'
import { Machine } from '../models/machine.js'
import { body, validationResult } from 'express-validator'

const router = Router()

router.get('/', (request, response) => {
    // View all machines
})

router.get('/new', (request, response) => {
    response.render('machines/new')
})

router.post('/',
    body('brand').isString().isLength({ max: 256 }).trim().escape(),
    body('name').isString().isLength({ max: 256 }).trim().escape(),
    async (request, response) => {
        try {
            validationResult(request).throw()

            const machine = new Machine({
                id: Math.floor(Math.random() * 100000),
                brand: request.body.brand,
                name: request.body.name
            })
            await machine.save()

            response.redirect(`machines/${machine.id}`)
        } catch(error) {
            console.log(error)
            response.send("This machine failed to be created.")
        }
    }
)

router.get('/:id', async (request, response) => {
    try {
        const machine = await Machine.findOne( { id: request.params.id }).exec()
        if (!machine) throw new Error ('Machine not found.')

        response.render('machines/show', { machine: machine })
    } catch(error) {
        console.error(error)
        response.status(404).send('Machine could not be found')
    }
})

export default router