const express = require("express");
const session = require("express-session");

const shopRouter = express.Router();

const Shop = require("../models/shop");
const Product = require("../models/product");
const User = require("../models/user");

//form shop register
shopRouter.get("/register", (req, res) => {
  res.render("shopRegister");
});

//register shop
shopRouter.post("/registerShop", async (req, res) => {
  const { shopName, adress } = req.body;
  const shop = new Shop({ shopName, adress, listOfProduts: [] });
  await shop.save();
  req.session.shopName = shopName;
  req.session._id = shop._id;
  // console.log(shop)
  res.redirect("/shop/personal");
});

//shop personal page
shopRouter.get("/personal", async (req, res) => {
  const shop = await Shop.findOne({ shopName: req.session.shopName });
  res.render("shopPersonal", { shop });
});

//shop add product and listProduct add
shopRouter.post("/personal", async (req, res) => {
  const { productName, expirationDate } = req.body;
  const findProduct = await Product.findOne({ productName });
  if (findProduct) {
    const addProduct = await Product.updateOne(
      { productName },
      { $push: { shops: req.session._id } }
    );
  } else {
    const product = new Product({
      productName,
      expirationDate,
      reserve: false,
      shops: req.session._id,
    });
    await product.save();
  }
  const addProduct = await Product.findOne({ productName });
  const addShop = await Shop.updateOne(
    { shopName: req.session.shopName },
    { $push: { listOfProduts: addProduct._id } }
  );

  res.redirect("/shop/products");
});

shopRouter.get("/products", async (req, res) => {
  const shop = await Shop.findOne({ shopName: req.session.shopName }).populate(
    "listOfProduts"
  );
  // const allProduct = await Shop.findOne({shopName: req.session.shopName}).populate("listOfProduts");
  // const allProduct = await Product.find().populate("shops");
  const shopProduct = await Shop.find({
    shopName: req.session.shopName,
  }).populate("listOfProduts");
  res.render("products", { shop });
});

//form of login
shopRouter.get("/signin", (req, res) => {
  res.render("shopSignin");
});

// auth
shopRouter.post("/signin", async (req, res) => {
  const { shopName, adress } = req.body;
  const shop = await Shop.findOne({ shopName });
  req.session.shopName = shopName;
  req.session._id = shop._id;
  console.log(req.session._id);
  res.redirect("/shop/products");
});

shopRouter.post("/find/product/:id", async (req, res) => {
  // console.log(req.params.id);
  const element = await Product.findById(req.params.id);
  console.log(element);
  const name = element.id;
  console.log(element.id);
  const shop = await Shop.updateOne(
    { shopName: req.session.shopName },
    { $pull: { listOfProduts: element.id } }
  );
  const user = await User.updateOne(
    { productReserve: element.id },
    { $pull: { productReserve: element.id } }
  );
  res.redirect("/shop/products");
});

//exit
shopRouter.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = shopRouter;
