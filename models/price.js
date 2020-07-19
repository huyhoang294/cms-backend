const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PriceSchema = new Schema({
  price_oneHour: {
    type: Number,
    required: true,
  },
  price_oneDay: {
    type: Number,
    required: true,
  },
  price_oneMonth: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("price", PriceSchema, "price");