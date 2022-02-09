const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const itemsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Item = mongoose.model("item", itemsSchema);
module.exports = Item;
