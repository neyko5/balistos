var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate')

var VideoSchema = new Schema({
  title: String,
  youtube_id: String
});

VideoSchema.plugin(findOrCreate);

module.exports = mongoose.model('Video', VideoSchema);
