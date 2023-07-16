import mongoose from "mongoose"

const { Schema } = mongoose

const shotSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bean: { type: Schema.Types.ObjectId, ref: "Bean", required: true },
  machine: { type: Schema.Types.ObjectId, ref: "Machine", required: true },
  grinder: { type: Schema.Types.ObjectId, ref: "Grinder", required: true },
  grinderSetting: { type: Number },
  grindsWeightGrams: { type: Number },
  durationSeconds: { type: Number },
  shotsWeightGrams: { type: Number },
  comments: { type: String },
  favorite: { type: Boolean },
  bodyRating: {
    type: Schema.Types.Number,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: "Ratings must be an integer.",
    },
  },
  aromaticsRating: {
    type: Schema.Types.Number,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: "Ratings must be an integer.",
    },
  },
  acidityRating: {
    type: Schema.Types.Number,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: "Ratings must be an integer.",
    },
  },
  sweetnessRating: {
    type: Schema.Types.Number,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: "Ratings must be an integer.",
    },
  },
  aftertasteRating: {
    type: Schema.Types.Number,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: "Ratings must be an integer.",
    },
  },
})

export const Shot = mongoose.model("Shot", shotSchema)
