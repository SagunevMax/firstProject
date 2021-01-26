const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
  userName: String,
  password: String,
  productReserve: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  salesProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const User = mongoose.model("User", userShema);

module.exports = User;
