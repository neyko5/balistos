import sequelize from '../database';
import Sequelize from 'sequelize';
import User from'./user';
import Chat from './chat';
import PlaylistVideo from './playlistVideo';

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
  tableName: 'playlists'
});

Playlist.belongsTo(User);
Playlist.hasMany(PlaylistVideo);
Playlist.hasMany(Chat);

module.exports = Playlist;
