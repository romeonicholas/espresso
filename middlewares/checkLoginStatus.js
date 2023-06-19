import { SECRET_JWT_CODE } from '../config/app.js'
import JSONWebToken from 'jsonwebtoken'

export const checkLoginStatus = (request, response, next) => {
    const token = request.cookies.access_token
    if (!token) { return next() }
    const data = JSONWebToken.verify(token, SECRET_JWT_CODE)
    response.locals._id = data._id
    response.locals.username = data.username
    response.locals.prefersDarkMode = data.prefersDarkMode
    return next()
}