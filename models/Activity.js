const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  activity: {
    type: String,
    required: [true, "Please add a title"],
  },
  date: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

module.exports =
  mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
