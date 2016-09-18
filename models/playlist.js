var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var PlaylistSchema = new Schema({
  title: String,
  description: String,
  uri: String,
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  videos: [{type: Schema.Types.ObjectId, ref: 'PlaylistVideo'}],
  chat: [{type: Schema.Types.ObjectId, ref: 'Chat'}]
});
PlaylistSchema.plugin(deepPopulate, {});

module.exports = mongoose.model('Playlist', PlaylistSchema);
