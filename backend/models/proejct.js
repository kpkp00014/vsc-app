const mongoose = require("mongoose");
const moment = require("moment");
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  created_date: {
    type: Date,
    default: moment().format("YYYY-MM-DD hh:mm:ss"),
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
    },
  ],
});

const Project = mongoose.model("project", ProjectSchema);

module.exports = Project;
