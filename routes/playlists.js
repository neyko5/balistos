var express = require('express');
var router = express.Router();
var Playlist = require('../models/playlist');
var PlaylistVideo = require('../models/playlistVideo');
var Video = require('../models/video');
var User = require('../models/user');
var Chat = require('../models/chat');
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
                      {model: PlaylistVideo, include: [Video]},
                      {model: Chat, include: [
                         {model: User, attributes: ['username']}
                      ]}
                    ]}).then(function(playlist){
    res.json(playlist);
  });
});

router.post('/', jwtauth, function(req, res, next) {
  Playlist.create({
    title : req.body.title,
    description: req.body.description,
    user_id: req.user_id
  }).then(function(user) {
    res.json({ success: true });
  });
});

module.exports = router;
