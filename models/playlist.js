var vogels = require('vogels');
var bcrypt = require('bcrypt');
var Joi = require('joi');

vogels.AWS.config.loadFromPath('credentials.json');

var Playlist = vogels.define("Playlist", {
  hashKey : 'uri',
  tableName: 'Playlist',
  schema : {
    uri: Joi.string(),
    title: Joi.string(),
    description: Joi.string()
  }
});

Playlist.before('create', function(data, next) {
  data.uri = data.title.replace(' ','_').replace(/\W+/g, " ").toLowerCase();
  next(null, data);
});

module.exports = Playlist;
