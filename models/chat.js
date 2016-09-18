var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  message: String,
  playlist: {type: mongoose.Schema.Types.ObjectId, ref: 'Playlist'},
  postedAt: Date
});

module.exports = mongoose.model('Chat', ChatSchema);
