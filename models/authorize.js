const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");
require("./cabinet");
require("./station");
// Create Schema
const AuthSchema = new Schema({
  authorize_id: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  box_id: {
    type: Schema.Types.ObjectId,
    ref: "cabinet",
    required: true,
  },

  station_id: {
    type: Schema.Types.ObjectId,
    ref: "station",
    required: true,
  },

  limit: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("authorize", AuthSchema, "authorize");
