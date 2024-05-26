const dotenv = require("dotenv").config();

let config = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: "mysql",
};


module.exports = {
  development: config,
  production: config,
};