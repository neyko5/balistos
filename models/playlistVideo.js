import sequelize from '../database';
import Sequelize from 'sequelize';

import Playlist from './playlist';
import User from './user';
import Video from './video';
import Like from './like';

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
  autoAdded: {
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
