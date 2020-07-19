const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");
require("./cabinet");
require("./station");
// Create Schema
const OwnSchema = new Schema({
  user_id: {
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

  start_time: {
    type: String,
    required: true,
  },

  end_time: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("own", OwnSchema, "own");