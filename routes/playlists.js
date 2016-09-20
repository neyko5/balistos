var express = require('express');
var router = express.Router();
var Playlist = require('../models/playlist');
var PlaylistVideo = require('../models/playlistVideo');
var Video = require('../models/video');
var User = require('../models/user');
var jwtauth = require('../auth/jwtauth');

/* GET home page. */
router.get('/', function(req, res, next) {
  Playlist.findAll({include: [{model: User, attributes: ['username']}, {model: PlaylistVideo, include: [Video]}]})
  .then(function(playlists) {
    res.json(playlists);
  });
});

router.get('/:playlist_uri', function(req, res, next) {
  Playlist.findOne({where: {uri: req.params.playlist_uri},
                    include: [
                      {model: User, attributes: ['username']},
                      {model: PlaylistVideo, include: [Video]}
                    ]}).then(function(playlist){
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
