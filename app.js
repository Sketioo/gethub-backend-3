const express = require("express");
const bodyParser = require("body-parser");
const { ActivatePassport } = require("./config/passport-config");
const passport = require("passport");
const session = require("express-session");

const userRoute = require("./routes/user");
const productRoute = require("./routes/product");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret:process.env.APP_SECRET,
    cookie: { maxAge: 60000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

ActivatePassport();

app.use("/api", userRoute);
app.use("/api", productRoute);

module.exports = app;
