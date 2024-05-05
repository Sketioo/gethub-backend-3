const {Sequelize, DataTypes} = require('sequelize');

const dbConfig = require('./config')

const sequelize = new Sequelize(dbConfig.test);

async function runDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

runDB();

module.exports = {sequelize, DataTypes};