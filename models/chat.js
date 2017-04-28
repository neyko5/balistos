var sequelize = require('../database');
var Sequelize = require('sequelize');
var User = require('./user');
var Playlist = require('./playlist');

var Chat = sequelize.define('chats', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  message: {
    type: Sequelize.TEXT,
    field: 'message'
  },
}, {
  tableName: 'chats'
});

Chat.belongsTo(User);

module.exports = Chat;
