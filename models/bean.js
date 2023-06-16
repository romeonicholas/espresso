import mongoose from 'mongoose'

const beanSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    brand: { type: String, required: true },
    variety: { type: String, required: true },
    roastDate: { type: Date }
})

export const Bean = mongoose.model('Bean', beanSchema)