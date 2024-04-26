const express = require('express');
const bodyParser = require('body-parser');

const userRoute = require('./routes/user');
const testRoutes = require('./routes/tests');

const app = express();

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));


app.use("/user", userRoute);
app.use("/test", testRoutes);

module.exports = app;
