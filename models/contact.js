const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");
// Create Schema
const ContactSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  contact_id: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});
module.exports = mongoose.model("contact", ContactSchema, "contact");