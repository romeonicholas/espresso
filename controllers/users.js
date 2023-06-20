import { Router } from 'express'
import { User } from '../models/user.js'
import { Shot } from '../models/shot.js'
import { Bean } from '../models/bean.js'
import { Machine } from '../models/machine.js'
import { SECRET_JWT_CODE, JWT_EXPIRES_IN } from '../config/app.js'
import { authenticateToken } from '../middlewares/authenticateToken.js'
import { checkLoginStatus } from '../middlewares/checkLoginStatus.js'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import JSONWebToken from 'jsonwebtoken'

const router = Router()

router.get('/', authenticateToken, (request, response) => {
    response.render('users/')
})

router.get('/new', checkLoginStatus, (request, response) => {
    response.render('users/new')
})

router.get('/me', authenticateToken, async (request, response) => {
    try {
        const user = await User.findById(response.locals.id).populate('machines').populate('beans').exec()
        console.log(user)
        response.render('users/me', { user: user })
    } catch(error) {
        console.error(error)
        response.send("An error ocurred while loading the dashboard.")
    }
})

router.get('/me/machines', authenticateToken, async (request, response) => {
    try {
        const user = await User.findById(response.locals.id).populate('machines').exec()
        response.send(user.machines)
        // response.render('users/machines', { machines: user.machines })
    } catch(error) {
        console.error(error)
        response.send("An error ocurred.")
    }
})

router.get('/me/machines/new', authenticateToken, async (request, response) => {
    try {
        const machines = await Machine.find({}).exec()
        response.render('users/machines/new', { machines: machines })
    } catch(error) {
        console.error(error)
        response.send("An error ocurred.")
    }
})

router.post('/me/machines', 
    authenticateToken, 
    body('machineId').isString().isLength({ min: 24, max: 24 }).trim().escape(),
    async (request, response) => {
        try {
            validationResult(request).throw()
            const user = await User.findById(response.locals.id).exec()
            user.machines.addToSet(request.body.machineId)
            await user.save()
            response.redirect('./')
        } catch (error) {
            console.error(error)
            response.send("Machine failed to be added to your account")
        }
})

router.get('/me/beans/new', authenticateToken, async (request, response) => {
    try {
        const beans = await Bean.find({}).exec()
        response.render('users/beans/new', { beans: beans })
    } catch(error) {
        console.error(error)
        response.send("An error ocurred.")
    }
})

router.post('/me/beans', 
    authenticateToken, 
    body('beanId').isString().isLength({ min: 24, max: 24 }).trim().escape(),
    async (request, response) => {
        try {
            validationResult(request).throw()
            const user = await User.findById(response.locals.id).exec()
            user.beans.addToSet(request.body.beanId)
            await user.save()
            response.redirect('./')
        } catch (error) {
            console.error(error)
            response.send("Beans failed to be added to your account")
        }
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
                const token = JSONWebToken.sign({ id: user._id, username: user.username }, SECRET_JWT_CODE, {
                    expiresIn: JWT_EXPIRES_IN,
                });
                
                response.cookie("access_token", token, { httpOnly: true }).redirect('/users/me');
            });
        } catch (error) {
            console.log(error)
            response.send("User failed to be created")
        }
    }
)

router.get('/login', checkLoginStatus, (request, response) => {
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
                    const token = JSONWebToken.sign({ id: user._id, username: user.username }, SECRET_JWT_CODE, {
                        expiresIn: JWT_EXPIRES_IN,
                    });

                    response.cookie("access_token", token, { httpOnly: true }).redirect('/users/me');
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

router.get('/logout', authenticateToken, (request, response) => {
    response.clearCookie('access_token').redirect('/users/login')
})

export default router