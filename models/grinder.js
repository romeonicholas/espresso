import mongoose from 'mongoose'

const grinderSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    brand: { type: String, required: true },
    name: { type: String, required: true }
})

export const Machine = mongoose.model('Grinder', grinderSchema)