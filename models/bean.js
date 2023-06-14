import mongoose from 'mongoose'

const beanSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    company: { type: String, required: true },
    name: { type: String, required: true },
    roastDate: { type: Date }
})

export const Bean = mongoose.model('Bean', beanSchema)