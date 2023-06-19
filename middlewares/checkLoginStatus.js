import { SECRET_JWT_CODE } from '../config/app.js'
import JSONWebToken from 'jsonwebtoken'

export const checkLoginStatus = (request, response, next) => {
    const token = request.cookies.access_token
    const data = JSONWebToken.verify(token, SECRET_JWT_CODE)
    response.locals.username = data.username
    return next()
}