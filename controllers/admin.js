import { Router } from 'express'
import { User } from '../models/user.js'
import { authenticateToken } from '../middlewares/authenticateToken.js'

const router = Router()

router.get('/unpublished', authenticateToken, (request, response) => {
    if (!response.locals.isAdmin) {
        response.redirect('/')
    }
    response.render('admin/')
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