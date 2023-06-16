import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    hashedPassword: { type: String, required: true },
    salt: { type: String, unique: true, required: true },
    prefersDarkMode: { type: Boolean, default: false }
})

export const User = mongoose.model('User', userSchema)