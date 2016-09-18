var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playlistVideoSchema = new Schema({
  addedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  video: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'},
  playlist: {type: mongoose.Schema.Types.ObjectId, ref: 'Playlist'},
  startedAt: Date
});

module.exports = mongoose.model('PlaylistVideo', playlistVideoSchema);
