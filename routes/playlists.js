var express = require('express');
var router = express.Router();
var Playlist = require('../models/playlist');
var PlaylistVideo = require('../models/playlistVideo');

/* GET home page. */
router.get('/', function(req, res, next) {
  Playlist.scan().loadAll().exec(function(err, playlists) {
    if (err) {
      return res.send(err);
    }

    res.json(playlists.Items);
  });
});

router.get('/:playlist_uri', function(req, res, next) {

  Playlist.get(req.body.username, function(err, playlist){
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
