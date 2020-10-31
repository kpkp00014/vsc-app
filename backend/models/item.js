const mongoose = require("mongoose");
const moment = require("moment");
const User = require("./user");
const ItemSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  isImage: {
    type: Boolean,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: moment().format("YYYY-MM-DD hh:mm:ss"),
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
});
ItemSchema.pre("remove", function (next) {
  User.update({ _id: this.owner }, { $pull: { items: this._id } });
});

const Item = mongoose.model("item", ItemSchema);
module.exports = Item;
