import sequelize from '../database';
import Sequelize from 'sequelize';

import Playlist from './playlist';

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
  tableName: 'playlistUsers'
});

PlaylistUser.belongsTo(Playlist);

module.exports = PlaylistUser;
