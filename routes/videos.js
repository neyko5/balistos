var express = require('express');
var router = express.Router();
var Video = require('../models/video');
var User = require('../models/user');
var Playlist = require('../models/playlist');
var PlaylistVideo = require('../models/playlistVideo');
var jwtauth = require('../auth/jwtauth');

/* GET home page. */
router.get('/', function(req, res, next) {
  Video.find(function(err, videos) {
    if (err) {
      return res.send(err);
    }

    res.json(videos);
  });
});

router.post('/add', jwtauth, function(req, res, next) {
  Video.findOrCreate({
    where: { youtube_id: req.body.youtube_id},
    defaults: { title: req.body.title }
  }).spread(function(video, created){
    PlaylistVideo.create({
      user_id: req.user_id,
      playlist_id: req.body.playlist_id,
      video_id: video.id
    }).then(function(playlistVideo){
      PlaylistVideo.findOne({ where: {id: playlistVideo.id}, include: [User, Video]}).then(function(videoResult){
        console.log("emmiting video to: " + req.body.playlist_uri);
        res.io.to(req.body.playlist_uri).emit('action', { type: "INSERT_VIDEO", video: videoResult });
        res.json({ success: true });
      });
    });
  });
});

module.exports = router;
