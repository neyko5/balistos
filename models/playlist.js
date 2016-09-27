var sequelize = require('../database');
var Sequelize = require('sequelize');
var User = require('./user');
var Chat = require('./chat');
var PlaylistVideo = require('./playlistVideo');
var PlaylistUser = require('./playlistUser');

var Playlist = sequelize.define('playlist', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    field: 'title'
  },
  description: {
    type: Sequelize.TEXT,
    field: 'description'
  },
}, {
  tableName: 'playlists',
  underscored: true,
});

Playlist.belongsTo(User);
Playlist.hasMany(PlaylistVideo);
Playlist.hasMany(Chat);
Playlist.hasMany(PlaylistUser);

module.exports = Playlist;
