const express = require("express");
const bodyParser = require("body-parser");
const { ActivatePassport } = require("./config/passport-config");
const passport = require("passport");
const session = require("express-session");
const helmet = require("helmet")

const { upload, imageUploader } = require("./helpers/image-uploader");

const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const linkRoute = require("./routes/link");
const enumeRoute = require("./routes/enumeration");
const sponsorRoute = require("./routes/sponsor");
const partnerRoute = require("./routes/partner");
const informationRoute = require("./routes/information");

const app = express();
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.APP_SECRET,
    cookie: { maxAge: 60000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

ActivatePassport();

app.use("/api", userRoute);
app.use("/api", productRoute);
app.use("/api", linkRoute);
app.use("/api", enumeRoute);
app.use("/api", sponsorRoute);
app.use("/api", partnerRoute);
app.use("/api", informationRoute);

//* Helper
app.post("/api/upload-file", upload.single("file"), imageUploader);

module.exports = app;
