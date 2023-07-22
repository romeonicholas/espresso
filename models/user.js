import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema } = mongoose

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: {
      validator: (v) => {
        return /^[a-z0-9]{4,16}$/.test(v)
      },
      message:
        "Username can only be a-z or 0-9 characters, with a length between 4 and 16.",
    },
  },
  hashedPassword: { type: String, required: true },
  prefersDarkMode: { type: Boolean, default: false },
  machines: [{ type: Schema.Types.ObjectId, ref: "Machine" }],
  beans: [{ type: Schema.Types.ObjectId, ref: "Bean" }],
  grinders: [{ type: Schema.Types.ObjectId, ref: "Grinder" }],
  shots: [{ type: Schema.Types.ObjectId, ref: "Shot" }],
  isAdmin: { type: Boolean, default: false, required: true },
})

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hashedPassword)
}

export const User = mongoose.model("User", userSchema)
