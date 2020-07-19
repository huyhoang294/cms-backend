const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");
require("./cabinet");
require("./station");
// Create Schema
const OrderSchema = new Schema({
  order_id: {
    type: String,
    required: true,
  },
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

  order_time: {
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
module.exports = mongoose.model("order", OrderSchema, "order");