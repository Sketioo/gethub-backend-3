const dotenv = require("dotenv").config();

let config = {
  username: process.env["DB_USERNAME"],
  password: process.env["DB_PASSWORD"],
  database: process.env["DB_DATABASE"],
  host: process.env["DB_HOST"],
  dialect: "mysql",
};

const passportConfig = {
  linkedinAuth: {
    clientID: process.env["CLIENT_ID"],
    clientSecret: process.env["CLIENT_SECRET"],
    callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
  },
};

module.exports = {
  development: config,
  test: config,
  production: config,
  passportConfig,
};
