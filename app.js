const path = require("path")

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require('cors');

const { upload, imageUploader } = require("./helpers/image-uploader");
const { ktpScannerController } = require("./helpers/ktp-scanner");
const { authenticateToken } = require("./middleware/check-auth");

const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const linkRoute = require("./routes/link");
const enumeRoute = require("./routes/enumeration");
const sponsorRoute = require("./routes/sponsor");
const partnerRoute = require("./routes/partner");
const informationRoute = require("./routes/information");
const certificateRoute = require("./routes/certification");
const projectRoute = require("./routes/project");
const categoryRoute = require("./routes/category");
const viewersRoute = require("./routes/viewers");
const paymentRoute = require("./routes/transaction");


const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use(cors());

app.use("/api", userRoute);
app.use("/api", productRoute);
app.use("/api", linkRoute);
app.use("/api", enumeRoute);
app.use("/api", sponsorRoute);
app.use("/api", partnerRoute);
app.use("/api", informationRoute);
app.use("/api", certificateRoute);
app.use("/api", categoryRoute);
app.use("/api", projectRoute);
app.use("/api", viewersRoute);
app.use('/api', paymentRoute)


//* Helper
app.post("/api/upload-file", authenticateToken, upload.single("file"), imageUploader);
app.post("/api/scan-ktp", authenticateToken, ktpScannerController);

app.use('*', (req, res) => {
  res.status(404).render('404')
})

module.exports = app;

