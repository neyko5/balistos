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
  active: {
    type: Sequelize.BOOLEAN,
    field: 'autoAdded'
  },
  startedAt:  {
    type     : Sequelize.INTEGER,
    allowNull: true,
    get      : function()  {
      if(this.getDataValue('startedAt')){
        return Math.round((new Date() - this.getDataValue('startedAt'))/1000);
      } else {
        return 0;
      }
    },
  },
}, {
  tableName: 'playlistVideos'
});

PlaylistVideo.belongsTo(Video);
PlaylistVideo.belongsTo(User);
PlaylistVideo.hasMany(Like);

module.exports = PlaylistVideo;
