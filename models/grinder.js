import mongoose from 'mongoose'

const grinderSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    name: { type: String, required: true },
    isPublished: { type: Boolean, default: false }
})

grinderSchema.index({ brand: 1, name: 1 }, { unique: true })

export const Grinder = mongoose.model('Grinder', grinderSchema)