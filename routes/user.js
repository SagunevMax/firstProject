const express = require("express");
const session = require("express-session");
const Product = require("../models/product");
const Shop = require("../models/shop");

const userRoter = express.Router();
const User = require("../models/user");

userRoter.get("/register", (req, res) => {
  res.render("userRegister");
});

userRoter.post("/register", async (req, res) => {
  const { userName, password } = req.body;

  const user = new User({
    userName,
    password,
    productReserve: [],
    salesProduct: [],
  });
  await user.save();
  req.session.userName = userName;
  req.session._id = user._id;
  res.redirect("/user/personal");
});

userRoter.get("/personal", async (req, res) => {
  const user = await User.findOne({ userName: req.session.userName }).populate('productReserve');
  // const item = await User.findById(req.params.id).populate('listOfProduts');
  res.render("userPersonal", { user });
});

userRoter.get("/signin", (req, res) => {
  res.render("userSignin");
});

userRoter.post("/signin", async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });
  req.session.userName = userName;
  req.session._id = user._id;
  res.redirect("/user/personal");
});

//поиск продукта в базе пользователем и данные из поля поиск
userRoter.post("/find", async (req, res) => {
  const { findProduct } = req.body; 
  const find = await Product.findOne({ productName: findProduct }).populate('shops');
  // const shop = await Shop.find({listOfProduts: findProduct})
  // console.log(shop)
  if (find) {
    res.render("findProduct", { find });
  } else {
    res.send("К сожалению, данный продукт не найден. Попробуйте позже!");
  }
});

//клик полозователем на ссылку магазина и переход к магазину со списком всех продуктов этого магазина которые не забронированы


//после бронирования бродукта меняется в базе поле и редирект на профиль юзера с продуктами которые в брони
userRoter.post('/find/product/:id', async (req, res, next) => {
 const item = await Product.findById(req.params.id)
//  console.log(item)
 const reserve = await Product.updateOne(
  { productName: item.productName },
  { $set: { reserve: true }});
  // console.log(reserve)
  const reserveUser = await User.updateOne(
    { userName: req.session.userName },
    { $push: { productReserve: item } }
  );
  res.redirect('/user/personal')
})

//ПОСМОТРЕТЬ НА КАРТЕ АДРЕС МАГАЗИНА
//АДРЕС МАГАЗИНА ВВОДИТСЯ ПРИ РЕГИСТРАЦИИ МАГАЗИНА ИЛИ КООРДИНАТЫ ЕГО ВВОДЯТ

userRoter.get("/find/:id", async (req, res) => {
  console.log(req.params.id);
  const item = await Shop.findById(req.params.id).populate('listOfProduts');
  console.log(item);
  const shop = await Shop.findById(req.params.id)
  const product = Product.find ({ $and:[{reserve: false}, {shops: shop._id}]})
  return res.render("userShop", { item, product });
});

userRoter.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = userRoter;
