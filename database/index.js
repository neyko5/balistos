var Sequelize = require('sequelize');
require('dotenv').config()

console.log("HOST",process.env.DB_HOST)

var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

module.exports = sequelize;
