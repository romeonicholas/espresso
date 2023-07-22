import mongoose from "mongoose"

const machineSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
    validate: {
      validator: (v) => {
        return !v.includes("$")
      },
      message: "Brand cannot contain dollar sign",
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
    validate: {
      validator: (v) => {
        return !v.includes("$")
      },
      message: "Name cannot contain dollar sign",
    },
  },
  isPublished: { type: Boolean, default: false, required: true },
})

machineSchema.index({ brand: 1, name: 1 }, { unique: true })

export const Machine = mongoose.model("Machine", machineSchema)
