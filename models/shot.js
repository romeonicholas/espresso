import mongoose from 'mongoose'

const shotSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    date: { type: Date, default: Date.now(), required: true },
    beans: { type: String, required: true },
    machine: { type: String, required: true },
    grindsWeight: { type: Number, required: true },
    shotsWeight: { type: Number, required: true },
    comments: { type: String }
})

export const Shot = mongoose.model('Shot', shotSchema)