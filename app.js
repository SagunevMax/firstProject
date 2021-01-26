const express = require("express");
const app = express();

const session = require("express-session");
const bodyParser = require('body-parser');
const MongoStore = require("connect-mongo")(session);
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// const productRouter = require("./routes/product");
const shopRouter = require("./routes/shop");
const userRoter = require("./routes/user");

const User = require("./models/user");
const Shop = require("./models/shop");
const Product = require("./models/product");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/shopProducts", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "hbs");

// const FileStore = sessionFileStore(session);

app.use(
  session({
    secret: "n4ffg6",
    store: new MongoStore({
      mongooseConnection: mongoose.createConnection('mongodb://localhost:27017/shopProducts', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }),
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  res.locals.userName = req.session.userName;
  res.locals._id = req.session._id;
  next();
});

app.use((req, res, next) => {
  res.locals.shopName = req.session.shopName;
  res.locals._id = req.session._id;
  next();
});


app.get("/", (req, res) => {
  res.render("headPage");
});

app.use("/shop", shopRouter);
// app.use("/product", productRouter);
app.use("/user", userRoter);


app.listen(3000);
