import { Router } from 'express'
import { User } from '../models/user.js'
import { Bean } from '../models/bean.js'
import { Machine } from '../models/machine.js'
import { Grinder } from '../models/grinder.js'
import { authenticateToken } from '../middlewares/authenticateToken.js'

const router = Router()

router.get('/unpublished', authenticateToken, async (request, response) => {
    if (!response.locals.isAdmin) {
        response.redirect('/')
    }
    const unpublishedBeans = await Bean.find( { isPublished: false }).exec()
    const unpublishedMachines = await Machine.find( { isPublished: false }).exec()
    const unpublishedGrinders = await Grinder.find( { isPublished: false }).exec()

    response.render('admin/unpublished', 
    { 
        unpublishedBeans: unpublishedBeans,
        unpublishedMachines: unpublishedMachines,
        unpublishedGrinders: unpublishedGrinders
    })
})

router.post('/unpublished', 
    authenticateToken, 
    async (request, response) => {
        try {
            const user = await User.findById(response.locals.id).exec()
            await user.save()
            response.redirect('/unpublished')
        } catch (error) {
            console.error(error)
            response.send("Failed to publish resources")
        }
})

export default router