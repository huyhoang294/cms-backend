const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./price");
// Create Schema
const StationSchema = new Schema({
  placename: {
    type: String,
  },
  address: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  no: {
    type: String,
    required: true,
  },
  coordinate: {
    latitude: Number,
    longitude: Number,
  },

  price_id: {
    type: Schema.Types.ObjectId,
    ref: "price",
    required: true,
  },
  active: {
    type: Boolean,
    require: true,
    default: true,
  },
});
module.exports = mongoose.model("station", StationSchema, "station");