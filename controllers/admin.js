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
    try {
        const unpublishedBeans = await Bean.find( { isPublished: false }).exec()
        const unpublishedMachines = await Machine.find( { isPublished: false }).exec()
        const unpublishedGrinders = await Grinder.find( { isPublished: false }).exec()
    
        response.render('admin/unpublished', 
        { 
            unpublishedBeans: unpublishedBeans,
            unpublishedMachines: unpublishedMachines,
            unpublishedGrinders: unpublishedGrinders
        })
    } catch (error) {
        console.error(error)
        response.send("Failed to get unpublished resources")
    }
    
})

router.post('/unpublished', 
    authenticateToken, 
    async (request, response) => {
        if (!response.locals.isAdmin) {
            response.redirect('/')
        }

        try {
            await Bean.updateMany( { _id: {$in : request.body.beans }}, { isPublished: true})
            await Machine.updateMany( { _id: {$in : request.body.machines }}, { isPublished: true})
            await Grinder.updateMany( { _id: {$in : request.body.grinders }}, { isPublished: true})

            response.redirect('/admin/unpublished')
        } catch (error) {
            console.error(error)
            response.send("Failed to publish resources")
        }
})

export default router