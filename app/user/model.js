const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Name is not empty"],
    maxLength: [255, "Maximum length of the name is not exceed 255 characters"],
    minLength: [3, "Minimum length of the name is not exceed 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is not empty"],
    maxLength: [
      255,
      "Maximum length of the email is not exceed 255 characters",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is not empty"],
    maxLength: [
      255,
      "Maximum length of the password is not exceed 255 characters",
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  token: [String],
});

userSchema.pre('save', async function(next) {
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})
const User = mongoose.model('User', userSchema)

module.exports = User
