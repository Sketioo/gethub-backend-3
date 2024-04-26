const express = require('express');
const bodyParser = require('body-parser');

const userRoute = require('./routes/user');
const testRoutes = require('./routes/tests');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use("/user", userRoute);
app.use("/test", testRoutes);

module.exports = app;
