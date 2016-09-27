var sequelize = require('../database');
var Sequelize = require('sequelize');

var PlaylistUser = sequelize.define('playlistUser', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    field: 'username',
  },
  playlist_id: {
    type: Sequelize.INTEGER,
    field: 'playlist_id'
  },
  count: {
    type: Sequelize.INTEGER,
    field: 'count'
  },
}, {
  tableName: 'playlist_users',
  underscored: true,
});

module.exports = PlaylistUser;
