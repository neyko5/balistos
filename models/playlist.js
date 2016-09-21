var sequelize = require('../database');
var Sequelize = require('sequelize');
var User = require('./user');
var Chat = require('./chat');
var PlaylistVideo = require('./playlistVideo');

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
  uri: {
    type: Sequelize.STRING,
    field: 'uri'
  },
  description: {
    type: Sequelize.TEXT,
    field: 'description'
  },
}, {
  tableName: 'playlists',
  underscored: true,
});

Playlist.beforeCreate(function(playlist, options, callback) {
  playlist.uri = playlist.title.replace(' ','_').replace(/\W+/g,'');
  callback(null, options);
});

Playlist.belongsTo(User);
Playlist.hasMany(PlaylistVideo);
Playlist.hasMany(Chat);

module.exports = Playlist;
