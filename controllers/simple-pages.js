import { Router } from 'express'
import got from 'got';

const router = Router()

router.get('/', async (request, response) => {
    const coffeePhotoLink = await got.get('https://coffee.alexflipnote.dev/random.json').json()
    response.render('index', { coffeePhotoLink: coffeePhotoLink.file})
})

router.get('/logout', (request, response) => {
    response.send('You are logged out.')
})

export default router