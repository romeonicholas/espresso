import 'dotenv/config'

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

export {
  PORT,
  MONGODB_URI,
  SECRET_JWT_CODE,
  JWT_EXPIRES_IN
}