import { Router } from 'express'
import { User } from '../models/user.js'
import { SECRET_JWT_CODE, JWT_EXPIRES_IN } from '../config/app.js'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import JSONWebToken from 'jsonwebtoken'

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

            bcrypt.hash(request.body.password, 10, async function (err, hash) {
                const user = new User({
                    username: request.body.username,
                    hashedPassword: hash,
                })
                await user.save()
                const token = JSONWebToken.sign({ id: user._id }, process.env.SECRET_JWT_CODE, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });

                response.redirect('/')
            });
        } catch (error) {
            console.log(error)
            response.send("User failed to be created")
        }
    }
)

router.get('/login', (request, response) => {
    response.render('users/login')
})

router.post(
    '/login',
    body('username').isString().isLength({ max: 36 }).trim().escape(),
    body('password').isString().isLength({ max: 256 }).trim().escape(),
    async (request, response) => {
        try {
            const user = await User.findOne({ username: request.body.username }).exec()
            if (!user) throw new Error('User not found.')

            bcrypt.compare(request.body.password, user.hashedPassword, function (err, result) {
                if (result === true) {
                    const token = JSONWebToken.sign({ id: user._id }, process.env.SECRET_JWT_CODE, {
                        expiresIn: process.env.JWT_EXPIRES_IN,
                    });
                    response.header('Authorization', 'Bearer '+ token).render('users/', { user: user })
                } else {
                    response.redirect('/')
                }
            });
        } catch (error) {
            console.error(error)
            response.status(404).send('User could not be found')
        }
    }
)

export default router