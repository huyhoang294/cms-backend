const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./user");
require("./cabinet");
require("./station");
// Create Schema
const AuthLogSchema = new Schema({
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

  action: {
    type: String,
    required: true,
  },

  authorize_time: {
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
  },

  index: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model(
  "authorize_log",
  AuthLogSchema,
  "authorize_log"
);
