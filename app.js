const express = require("express");
const bodyParser = require("body-parser");
const { ActivatePassport } = require("./config/passport-config");
const passport = require("passport");
const session = require("express-session");

const userRoute = require("./routes/user");
const testRoutes = require("./routes/tests");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.use(passport.initialize());
app.use(passport.session());

ActivatePassport();

app.use("/api", userRoute);
app.use("/test", testRoutes);

module.exports = app;
