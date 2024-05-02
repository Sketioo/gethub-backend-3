const dotenv = require("dotenv").config();

let config = {
  username: process.env["DB_USERNAME"],
  password: process.env["DB_PASSWORD"],
  database: process.env["DB_DATABASE"],
  host: process.env["DB_HOST"],
  dialect: "mysql",
};


module.exports = {
  development: config,
  test: config,
  production: config,
};




// let config = {
//   username: 'root',
//   password: 'IVk(C-\VO1~?>nmv',
//   database: 'cloudsql-gethub',
//   host: 'http://34.101.184.13',
//   dialect: "mysql",
// };