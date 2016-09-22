var express = require('express');
var router = express.Router();
var Video = require('../models/video');
var User = require('../models/user');
var Like = require('../models/like');
var Playlist = require('../models/playlist');
var PlaylistVideo = require('../models/playlistVideo');
var jwtauth = require('../middleware/jwtauth');

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
      PlaylistVideo.findOne({ where: {id: playlistVideo.id}, include: [User, Video, Like]}).then(function(videoResult){
        res.io.to("playlist_" + req.body.playlist_id).emit('action', { type: "INSERT_VIDEO", video: videoResult });
        res.json({ success: true });
      });
    });
  });
});

router.post('/like', jwtauth, function(req, res, next) {
  Like.findOrCreate({
    where: { playlist_video_id: req.body.video_id, user_id: req.user_id }
  }).spread(function(like, created){
    like.update({
      value: req.body.value
    }).then((result) => {
      PlaylistVideo.findById(req.body.video_id).then((playlistVideo) => {
        res.io.to("playlist_" + playlistVideo.playlist_id).emit('action', { type: "UPDATE_OR_INSERT_LIKE", like: result });
        res.json({ success: true });
      });
    });
  });
});

module.exports = router;
