import mongoose from "mongoose"

const { Schema } = mongoose

const shotSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bean: { type: Schema.Types.ObjectId, ref: "Bean", required: true },
  machine: { type: Schema.Types.ObjectId, ref: "Machine", required: true },
  grinder: { type: Schema.Types.ObjectId, ref: "Grinder", required: true },
  grinderSetting: {
    type: Number,
    min: 0,
    max: 100,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    validate: {
      validator: Number.isInteger,
      message: "Grinder setting must be an integer.",
    },
  },
  grindsWeightGrams: {
    type: Number,
    min: 0,
    max: 100,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    validate: {
      validator: Number.isInteger,
      message: "Weight of grinds must be an integer.",
    },
  },
  durationSeconds: {
    type: Number,
    min: 0,
    max: 100,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    validate: {
      validator: Number.isInteger,
      message: "Duration must be an integer.",
    },
  },
  shotsWeightGrams: {
    type: Number,
    min: 0,
    max: 100,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    validate: {
      validator: Number.isInteger,
      message: "Weight of shot must be an integer.",
    },
  },
  comments: {
    type: String,
    trim: true,
    maxLength: 300,
    validate: {
      validator: (v) => {
        return !v.includes("$")
      },
      message: "Message cannot contain dollar sign",
    },
  },
  favorite: {
    type: Boolean,
  },
  bodyRating: {
    type: Number,
    min: 1,
    max: 5,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    validate: {
      validator: Number.isInteger,
      message: "Ratings must be an integer.",
    },
  },
  aromaticsRating: {
    type: Number,
    min: 1,
    max: 5,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    validate: {
      validator: Number.isInteger,
      message: "Ratings must be an integer.",
    },
  },
  acidityRating: {
    type: Number,
    min: 1,
    max: 5,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    validate: {
      validator: Number.isInteger,
      message: "Ratings must be an integer.",
    },
  },
  sweetnessRating: {
    type: Number,
    min: 1,
    max: 5,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    validate: {
      validator: Number.isInteger,
      message: "Ratings must be an integer.",
    },
  },
  aftertasteRating: {
    type: Schema.Types.Number,
    min: 1,
    max: 5,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    validate: {
      validator: Number.isInteger,
      message: "Ratings must be an integer.",
    },
  },
})

shotSchema.index({ comments: "text" })

export const Shot = mongoose.model("Shot", shotSchema)
