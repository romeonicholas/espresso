import { Router } from 'express'
import got from 'got';
import { authenticateToken } from '../middlewares/authenticateToken.js'
import { checkLoginStatus } from '../middlewares/checkLoginStatus.js';


const router = Router()

router.get('/', checkLoginStatus, async (request, response) => {
    try {
        const coffeePhotoJSON = await got.get('https://coffee.alexflipnote.dev/random.json').json()
        const coffeePhotoLink = coffeePhotoJSON.file
        if(!coffeePhotoLink) {
            coffeePhotoLink = 'https://sc.mogicons.com/c/177.jpg'
        }
        response.render('index', { pageTitle: 'Home', coffeePhotoLink: coffeePhotoLink })
    } catch(error) {
        console.error(error)
        response.redirect('/error')
    }
})

router.get('/error', checkLoginStatus, (request, response) => {
    try {
        response.render('error/error', { pageTitle: 'Error' })
    } catch(error) {
        console.error(error)
        response.send("Something went terribly wrong!")
    }
})

export default router