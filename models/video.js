var sequelize = require('../database');
var Sequelize = require('sequelize');

var Video = sequelize.define('video', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    field: 'title'
  },
  youtube_id: {
    type: Sequelize.STRING,
    field: 'youtube_id'
  },
}, {
  tableName: 'videos',
  underscored: true,
});

module.exports = Video;
