var sequelize = require('../database');
var Sequelize = require('sequelize');
var User = require('./user');

var Like = sequelize.define('likes', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  value: {
    type: Sequelize.INTEGER,
    field: 'value'
  },
}, {
  tableName: 'likes'
});

Like.belongsTo(User);

module.exports = Like;
