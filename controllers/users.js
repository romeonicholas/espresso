import { Router } from 'express'
import { User } from '../models/user.js'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'

const router = Router()

router.get('/new', (request, response) => {
    response.render('users/new')
})

router.post(
    '/', 
    body('username').isString().isLength({ max: 36 }).trim().escape(),
    body('password').isString().isLength({ max: 256 }).trim().escape(),
    async (request, response) => {
        try {
            validationResult(request).throw()

            bcrypt.hash(request.body.password, 10, async function(err, hash) {
                const user = new User({
                    username: request.body.username,
                    hashedPassword: hash,
                })
                await user.save()
               
                response.redirect('/')
            });
        } catch(error) {
            console.log(error)
            response.send("User failed to be created")
        }
    }
)

export default router