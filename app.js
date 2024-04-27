const express = require("express");
const bodyParser = require("body-parser");
const {passportStrategy} = require("./config/passport-config");
const passport = require("passport");
const session = require("express-session");

const userRoute = require("./routes/user");
const testRoutes = require("./routes/tests");

const app = express();

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

// console.log(typeof passportStrategy);
// passportStrategy.use

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});



app.use("/api", userRoute);
app.use("/test", testRoutes);

module.exports = app;
