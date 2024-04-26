const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('db_local', 'root', '', {
  host: 'localhost',
  dialect: 'mysql' ,
});

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