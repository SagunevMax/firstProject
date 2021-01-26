const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  shopName: String,
  adress: String,
  listOfProduts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
