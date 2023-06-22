import mongoose from 'mongoose'

const grinderSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    name: { type: String, required: true },
    published: { type: Boolean }
})

grinderSchema.index({ brand: 1, name: 1 }, { unique: true })

export const Grinder = mongoose.model('Grinder', grinderSchema)