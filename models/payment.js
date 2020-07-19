const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./order");
// Create Schema
const PaymentSchema = new Schema({
  pay_service: {
    type: String,
    required: true,
  },

  pay_num: {
    type: String,
    required: true,
  },

  pay_info: {
    customerNumber: String,
  },

  pay_date: {
    type: String,
    required: true,
  },

  cost: { type: String, required: true },

  order_id: { type: String, ref: "order", required: true },

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
module.exports = mongoose.model("payment", PaymentSchema, "payment");