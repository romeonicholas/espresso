import { Router } from 'express'

const router = Router()

router.get('/', (request, response) => {
    response.render('index')
})

router.get('/logout', (request, response) => {
    response.send('You are logged out.')
})

export default router