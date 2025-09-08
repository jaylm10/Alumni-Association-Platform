const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String,
    profilePictureUrl: {
    type: String,
    default: '' // Start with an empty string
  }
});

module.exports = mongoose.model("register", userSchema);