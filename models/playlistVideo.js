var sequelize = require('../database');
var Sequelize = require('sequelize');

var Playlist = require('./playlist');
var User = require('./user');
var Video = require('./video');
var Like = require('./like');

var PlaylistVideo = sequelize.define('playlistVideo', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  active: {
    type: Sequelize.BOOLEAN,
    field: 'active'
  },
  started_at:  {
    type     : Sequelize.INTEGER,
    allowNull: true,
    get      : function()  {
      if(this.getDataValue('started_at')){
        return Math.round((new Date() - this.getDataValue('started_at'))/1000);
      } else {
        return 0;
      }
    },
  },
}, {
  tableName: 'playlist_videos',
  underscored: true,
});

PlaylistVideo.belongsTo(Video);
PlaylistVideo.belongsTo(User);
PlaylistVideo.hasMany(Like);

module.exports = PlaylistVideo;
