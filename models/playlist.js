var sequelize = require('../database');
var Sequelize = require('sequelize');
var User = require('./user');
var PlaylistVideo = require('./playlistVideo');

var Playlist = sequelize.define('playlist', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true
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

module.exports = Playlist;
