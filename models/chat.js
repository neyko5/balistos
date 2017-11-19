import sequelize from '../database';
import Sequelize from 'sequelize';
import User from './user';
import Playlist from './playlist';

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
