const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },

  sex: {
    type: String,
    enum: ["male", "female"],
  },

  birthday: {
    type: Date,
  },

  phonenum: {
    type: String,
  },

  online: {
    type: Boolean,
    require: true,
    default: false,
  },

  active: {
    type: Boolean,
    require: true,
    default: true,
  },

  loginState: {
    type: Boolean,
    require: true,
    default: false,
  },
});
module.exports = mongoose.model("user", UserSchema, "user");