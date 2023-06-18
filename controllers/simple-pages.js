import { Router } from 'express'
import got from 'got';
import { authenticateToken } from '../middlewares/authenticateToken.js'


const router = Router()

router.get('/', async (request, response) => {
    try {
        const coffeePhotoJSON = await got.get('https://coffee.alexflipnote.dev/random.json').json()
        const coffeePhotoLink = coffeePhotoJSON.file
        if(!coffeePhotoLink) {
            coffeePhotoLink = 'https://sc.mogicons.com/c/177.jpg'
        }
        response.render('index', { coffeePhotoLink: coffeePhotoLink})
    } catch(error) {
        console.error(error)
        response.send("An error ocurred while loading the dashboard.")
    }
    
})

router.get('/logout', authenticateToken, (request, response) => {
    response.send('You are logged out.')
})

export default router