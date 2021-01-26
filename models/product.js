const mongoose = require("mongoose");

const productShema = new mongoose.Schema({
  productName: String,
  expirationDate: Date,
  reserve: Boolean,
  shops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop'}],
});

const Product = mongoose.model("Product", productShema);

module.exports = Product;
