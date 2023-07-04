import { Router } from 'express'
import { Bean } from '../models/bean.js'
import { body, validationResult } from 'express-validator'
import { authenticateToken } from '../middlewares/authenticateToken.js'


const router = Router()

router.get('/new', authenticateToken, async (request, response) => {
    response.render('beans/new', { pageTitle: 'Submit Beans' })
})

router.get('/:id', authenticateToken, async (request, response) => {
    try {
        const bean = await Bean.findById(request.params.id).exec()
        if (!bean) throw new Error ('Beans not found.')

        response.render('beans/show', { bean: bean })
    } catch(error) {
        console.error(error)
        response.status(404).send('Beans could not be found')
    }
})

router.post('/',
    authenticateToken, 
    body('brand').isString().isLength({ max: 256 }).trim().escape(),
    body('variety').isString().isLength({ max: 256 }).trim().escape(),
    async (request, response) => {
        try {
            validationResult(request).throw()

            const bean = new Bean({
                brand: request.body.brand,
                variety: request.body.variety,
            })
            await bean.save()

            response.redirect(`beans/${bean._id.toString()}`)
        } catch(error) {
            console.log(error)
            response.send("These beans failed to be created.")
        }
    }
)

export default router