const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");
require("./cabinet");
require("./station");
// Create Schema
const OpenLogSchema = new Schema({
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

  open_time: {
    type: String,
    required: true,
  },

  nonce: {
    type: Number,
    required: true,
  },

  timestamp: {
    type: Number,
    required: true,
  },

  previousHash: {
    type: String,
    required: true,
  },

  Hash: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
    default: "unknown",
  },

  index: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("open_log", OpenLogSchema, "open_log");