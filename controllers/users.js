import { Router } from 'express'
import { User } from '../models/user.js'
import { Shot } from '../models/shot.js'
import { Bean } from '../models/bean.js'
import { Machine } from '../models/machine.js'
import { Grinder } from '../models/grinder.js'
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
    response.render('users/new', { pageTitle: 'Sign Up' })
})

router.get('/me', authenticateToken, async (request, response) => {
    try {
        const user = await User.findById(response.locals.id)
            .populate('machines')
            .populate('beans')
            .populate('grinders')
            .populate({ path: 'shots', options: { sort: { date: -1 }, limit: 5 } }).exec()
        response.render('users/me', { pageTitle: 'Dashboard', user: user })
    } catch(error) {
        console.error(error)
        response.send("An error ocurred while loading the dashboard.")
    }
})

router.get('/me/shots', authenticateToken, async (request, response) => {
    try {
        console.log(response.locals)
        const shots = await Shot.find( { user: response.locals.id }).exec()
        console.log(shots)
        const user = await User.findById(response.locals.id)
            .populate({ path: 'shots', options: { sort: { date: -1 } } } ).exec()
        response.render('users/shots/index', { pageTitle: 'My Shot History', shots: user.shots })
    } catch(error) {
        console.error(error)
        response.send("An error ocurred.")
    }
})

router.get('/me/machines', authenticateToken, async (request, response) => {
    try {
        const user = await User.findById(response.locals.id).populate('machines').exec()
        response.send(user.machines)
    } catch(error) {
        console.error(error)
        response.send("An error ocurred.")
    }
})

router.get('/me/machines/new', authenticateToken, async (request, response) => {
    try {
        const user = await User.findById(response.locals.id)
        const newMachines = await Machine.find({ isPublished: true, _id: { $nin: user.machines } })
            .sort( { brand: 1 })
            .lean()
        
        const machineMap = new Map()
        newMachines.forEach(machine => {
            if (!machineMap.has(machine.brand)) {
                machineMap.set(`${machine.brand}`, [[machine.name, machine._id]])
            } else {
                machineMap.get(`${machine.brand}`).push([machine.name, machine._id])
            }
        }) 

        response.render('users/machines/new', { pageTitle: 'Add Machines', machineMap: machineMap })
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

router.get('/me/grinders/new', authenticateToken, async (request, response) => {
    try {
        const user = await User.findById(response.locals.id).exec()
        const grinders = await Grinder.find({ isPublished: true, _id: { $nin: user.grinders } }).exec()
        response.render('users/grinders/new', { pageTitle: 'Add Grinders', grinders: grinders })
    } catch(error) {
        console.error(error)
        response.send("An error ocurred.")
    }
})

router.post('/me/grinders', 
    authenticateToken, 
    body('grinderId').isString().isLength({ min: 24, max: 24 }).trim().escape(),
    async (request, response) => {
        try {
            validationResult(request).throw()
            const user = await User.findById(response.locals.id).exec()
            user.grinders.addToSet(request.body.grinderId)
            await user.save()
            response.redirect('./')
        } catch (error) {
            console.error(error)
            response.send("Grinder failed to be added to your account")
        }
})

router.get('/me/beans/new', authenticateToken, async (request, response) => {
    try {
        const user = await User.findById(response.locals.id)
        const newBeans = await Bean.find({ isPublished: true, _id: { $nin: user.beans } })
            .sort( { brand: 1 })
            .lean()
        
        const beanMap = new Map()
        newBeans.forEach(bean => {
            if (!beanMap.has(bean.brand)) {
                beanMap.set(`${bean.brand}`, [[bean.variety, bean._id]])
            } else {
                beanMap.get(`${bean.brand}`).push([bean.variety, bean._id])
            }
        }) 
        
        response.render('users/beans/new', { pageTitle: 'Add Beans', beanMap: beanMap })
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

router.get('/me/:resource/:id/delete', authenticateToken, async (request, response) => {
    try {
        const resource = request.params.resource

        if (resource !== 'beans' && resource !== 'machines' && resource !== 'grinders') {
            response.status(404).send('Page not found')
        } else {
            const user = await User.findById(response.locals.id)
            let updatedResource = user[resource].filter(resource => resource._id.toString() !== request.params.id)
            await user.set(resource, updatedResource).save()
            response.redirect('/users/me')
        }
    } catch(error) {
        console.error(error)
        response.send('Resource could not be deleted')
    }
})

router.post(
    '/',
    body('username').custom(async value => {
        const usernameRegex = /^[a-zA-Z0-9]{4,16}$/
        if (!usernameRegex.test(value)) {
            throw new Error('Username does not meet requirements.')
        }
    }).trim().escape(),
    body('password').custom(async value => {
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}/
        if (!passwordRegex.test(value)) {
            throw new Error('Password does not meet requirements.')
        }
    }).trim().escape(),
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
            console.error(error)
            response.send("User failed to be created")
        }
    }
)

router.get('/login', checkLoginStatus, (request, response) => {
    response.render('users/login', { pageTitle: 'Log In' })
})

router.post(
    '/login',
    body('username').isString().trim().escape(),
    body('password').isString().trim().escape(),
    async (request, response) => {
        try {
            const user = await User.findOne({ username: request.body.username }).exec()
            if (!user) throw new Error('User not found.')

            bcrypt.compare(request.body.password, user.hashedPassword, function (err, result) {
                if (result === true) {
                    const token = JSONWebToken.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, SECRET_JWT_CODE, {
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

router.get('/logout', (request, response) => {
    response.clearCookie('access_token').redirect('/')
})

export default router