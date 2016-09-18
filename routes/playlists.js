var express = require('express');
var router = express.Router();
var Playlist = require('../models/playlist');
var PlaylistVideo = require('../models/playlistVideo');

/* GET home page. */
router.get('/', function(req, res, next) {
  Playlist.find(function(err, playlists) {
    if (err) {
      return res.send(err);
    }

    res.json(playlists);
  });
});

router.get('/:playlist_uri', function(req, res, next) {

  Playlist.findOne({ 'uri': req.params.playlist_uri }).deepPopulate('videos.video').exec(function(err, playlist) {
    if (err) {
      return res.send(err);
    }
    res.json(playlist);
  });
});

router.post('/', function(req, res, next) {
  var playlist = new Playlist(req.body);
  playlist.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ message: 'Playlist Created' });
  });
});

module.exports = router;
