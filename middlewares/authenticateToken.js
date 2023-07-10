import { SECRET_JWT_CODE } from '../config/app.js'
import JSONWebToken from 'jsonwebtoken'

export const authenticateToken = (request, response, next) => {
    const token = request.cookies.access_token
    if (!token) {
        return response.redirect('/users/login')
    }
    try {
        const data = JSONWebToken.verify(token, SECRET_JWT_CODE)
        response.locals.id = data.id
        response.locals.username = data.username
        response.locals.prefersDarkMode = data.prefersDarkMode
        response.locals.isAdmin = data.isAdmin
        return next()
    } catch {
        return response.redirect('/users/logout')
    }
}
