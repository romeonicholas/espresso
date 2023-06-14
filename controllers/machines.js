import { Router } from 'express'
import { Machine } from '../models/machine.js'

const router = Router()

router.get('/', (request, response) => {
    // View all machines
})

router.get('/new', (request, response) => {
    // View form to add machine
})

router.post('/new', (request, response) => {
    // Send to /machines after posting
})

router.get('/:id', (request, response) => {
    // View specific machine
})

export default router