import mongoose from 'mongoose'

const machineSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    name: { type: String, required: true }
})

machineSchema.index({ brand: 1, name: 1 }, { unique: true })

export const Machine = mongoose.model('Machine', machineSchema)