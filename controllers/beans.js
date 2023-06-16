import { Router } from 'express'
import { Bean } from '../models/bean.js'
import { body, validationResult } from 'express-validator'

const router = Router()

router.get('/new', async (request, response) => {
    response.render('beans/new')
})

router.get('/:id', async (request, response) => {
    try {
        const bean = await Bean.findOne( { id: request.params.id }).exec()
        if (!bean) throw new Error ('Beans not found.')

        response.render('beans/show', { bean: bean })
    } catch(error) {
        console.error(error)
        response.status(404).send('Beans could not be found')
    }
})

router.post('/',
    body('brand').isString().isLength({ max: 256 }).trim().escape(),
    body('variety').isString().isLength({ max: 256 }).trim().escape(),
    async (request, response) => {
        try {
            validationResult(request).throw()

            const bean = new Bean({
                id: Math.floor(Math.random() * 100000),
                brand: request.body.brand,
                variety: request.body.variety
            })
            await bean.save()

            response.redirect(`beans/${bean.id}`)
        } catch(error) {
            console.log(error)
            response.send("These beans failed to be created.")
        }
    }
)

export default router