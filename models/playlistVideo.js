var sequelize = require('../database');
var Sequelize = require('sequelize');

var Playlist = require('./playlist');
var User = require('./user');
var Video = require('./video');

var PlaylistVideo = sequelize.define('playlistVideo', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
}, {
  tableName: 'playlist_videos',
  underscored: true,
});

PlaylistVideo.belongsTo(Video);
PlaylistVideo.belongsTo(User);

module.exports = PlaylistVideo;
