const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./station");
// Create Schema
const CabinetSchema = new Schema({
  no: {
    type: Number,
    required: true,
  },
  state: {
    type: Number,
    required: true,
    enum: [0, 1],
    default: 0,
  },

  station_id: {
    type: Schema.Types.ObjectId,
    ref: "station",
    required: true,
  },

  status: {
    type: Number,
    required: true,
    enum: [0, 1],
    default: 1,
  },
  active: {
    type: Boolean,
    require: true,
    default: true,
  },
});
module.exports = mongoose.model("cabinet", CabinetSchema, "cabinet");
