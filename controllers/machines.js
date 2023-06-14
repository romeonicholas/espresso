import { Router } from 'express'
import { Machine } from '../models/machine.js'

const router = Router()

router.get('/machines', (request, response) => {
    // View all machines
})

router.get('/machines/new', (request, response) => {
    // View form to add machine
})

router.post('/machines/new', (request, response) => {
    // Send to /machines after posting
})

router.get('/machines/:id', (request, response) => {
    // View specific machine
})

export default router