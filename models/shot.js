import mongoose from 'mongoose'

const { Schema } = mongoose

const shotSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now, required: true },
    grindsWeightGrams: { type: Number, required: true },
    shotsWeightGrams: { type: Number, required: true },
    durationSeconds: { type: Number, required: true },
    comments: { type: String },
    favorite: { type: Boolean },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bean: { type: Schema.Types.ObjectId, ref: 'Bean', required: true },
    beanRoastDate: { type: Date },
    machine: { type: Schema.Types.ObjectId, ref: 'Machine', required: true },
    grinder: { type: Schema.Types.ObjectId, ref: 'Grinder' },
    bodyRating: { 
        type: Schema.Types.Number,
        min: 1,
        max: 5,
        validate: { validator: Number.isInteger, message: "Ratings must be an integer." }
    },
    aromaticsRating: { 
        type: Schema.Types.Number,
        min: 1,
        max: 5,
        validate: { validator: Number.isInteger, message: "Ratings must be an integer." }
    },
    acidityRating: { 
        type: Schema.Types.Number,
        min: 1,
        max: 5,
        validate: { validator: Number.isInteger, message: "Ratings must be an integer." }
    },
    sweetnessRating: { 
        type: Schema.Types.Number,
        min: 1,
        max: 5,
        validate: { validator: Number.isInteger, message: "Ratings must be an integer." }
    },
    aftertasteRating: { 
        type: Schema.Types.Number,
        min: 1,
        max: 5,
        validate: { validator: Number.isInteger, message: "Ratings must be an integer." }
    }
})

export const Shot = mongoose.model('Shot', shotSchema)