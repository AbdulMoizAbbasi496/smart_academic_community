const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  page: {
    type: String,
    default: "home"
  },
  count: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Visit", visitSchema);