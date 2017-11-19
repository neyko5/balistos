import sequelize from '../database';
import Sequelize from 'sequelize';

var Video = sequelize.define('video', {
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
  youtubeId: {
    type: Sequelize.STRING,
    field: 'youtubeId'
  },
}, {
  tableName: 'videos'
});

module.exports = Video;
