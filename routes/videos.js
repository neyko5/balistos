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
      video_id: video.id,
      active: 1
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
    where: { playlist_video_id: req.body.video_id, user_id: req.user_id },
  }).spread(function(like, created){
    like.update({
      value: req.body.value
    }).then((result) => {
      Like.findOne({ where: {id: like.id}, include: [{model: User, attributes: ['username']}]}).then((likeResult) => {
        PlaylistVideo.findById(req.body.video_id).then((playlistVideo) => {
          res.io.to("playlist_" + playlistVideo.playlist_id).emit('action', { type: "UPDATE_OR_INSERT_LIKE", like: likeResult });
          res.json({ success: true });
        });
      });
    });
  });
});

router.post('/finish', jwtauth, function(req, res, next) {
  PlaylistVideo.findOne({where: {id: req.body.video_id}}).then(function(video) {
    video.update({active: 0}).then(function(result) {
      res.io.to("playlist_" + video.playlist_id).emit('action', {type: "DEACTIVATE_VIDEO", video_id: video.id});
      res.json({success: true});
    });
  });
});

router.post('/start', jwtauth, function(req, res, next) {
  PlaylistVideo.findOne({where: {id: req.body.video_id}}).then(function(video) {
    if(!video.started_at) {
      video.update({started_at: new Date()});
    }
  });
});

router.post('/delete', jwtauth, function(req, res, next) {
  PlaylistVideo.findOne({where: {id: req.body.video_id}}).then(function(video) {
    video.destroy().then(function(result) {
      res.io.to("playlist_" + video.playlist_id).emit('action', {type: "REMOVE_VIDEO", video_id: video.id});
      res.json({success: true});
    });
  });
});


module.exports = router;
