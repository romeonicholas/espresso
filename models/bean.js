import mongoose from "mongoose"

const beanSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  name: { type: String, required: true },
  isPublished: { type: Boolean, default: false, required: true },
})

beanSchema.index({ brand: 1, name: 1 }, { unique: true })

export const Bean = mongoose.model("Bean", beanSchema)
