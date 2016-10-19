var sequelize = require('../database');
var Sequelize = require('sequelize');

var Playlist = require('./playlist');
var User = require('./user');

var PlaylistUser = sequelize.define('playlistUser', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    field: 'username'
  },
}, {
  tableName: 'playlist_users',
  underscored: true,
});

PlaylistUser.belongsTo(Playlist);

module.exports = PlaylistUser;
