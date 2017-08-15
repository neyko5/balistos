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
    where: { youtubeId: req.body.youtubeId},
    defaults: { title: req.body.title }
  }).spread(function(video, created){
    PlaylistVideo.create({
      userId: req.userId,
      playlistId: req.body.playlistId,
      videoId: video.id,
      active: 1,
      autoAdded: req.body.autoAdded
    }).then(function(playlistVideo){
      PlaylistVideo.findOne({ where: {id: playlistVideo.id}, include: [User, Video, Like]}).then(function(videoResult){
        res.io.to("playlist_" + req.body.playlistId).emit('action', { type: "INSERT_VIDEO", video: videoResult });
        res.status(201).json({ success: true, message: 'Video successfully added.' });
      });
    });
  });
});

router.post('/like', jwtauth, function(req, res, next) {
  Like.findOrCreate({
    where: { playlistVideoId: req.body.videoId, userId: req.userId },
  }).spread(function(like, created){
    like.update({
      value: req.body.value
    }).then((result) => {
      Like.findOne({ where: {id: like.id}, include: [{model: User, attributes: ['username']}]}).then((likeResult) => {
        PlaylistVideo.findById(req.body.videoId).then((playlistVideo) => {
          res.io.to("playlist_" + playlistVideo.playlistId).emit('action', { type: "UPDATE_OR_INSERT_LIKE", like: likeResult });
          res.json({ success: true, message: 'Video successfully liked.' });
        });
      });
    });
  });
});

router.post('/finish', jwtauth, function(req, res, next) {
  PlaylistVideo.findOne({where: {id: req.body.videoId}}).then(function(video) {
    video.update({active: 0}).then(function(result) {
      res.io.to("playlist_" + video.playlistId).emit('action', {type: "DEACTIVATE_VIDEO", videoId: video.id});
      res.json({success: true,  message: 'Video successfully finished.' });
    });
  });
});

router.post('/start', jwtauth, function(req, res, next) {
  PlaylistVideo.findOne({where: {id: req.body.videoId}}).then(function(video) {
    if(video && !video.startedAt) {
      video.update({startedAt: new Date()});
      res.json({success: true,  message: 'Video successfully started.' });
    }
  });
});

router.post('/delete', jwtauth, function(req, res, next) {
  PlaylistVideo.findOne({where: {id: req.body.videoId}}).then(function(video) {
    video.destroy().then(function(result) {
      res.io.to("playlist_" + video.playlistId).emit('action', {type: "REMOVE_VIDEO", videoId: video.id});
      res.json({success: true, message: 'Video successfully deleted'});
    });
  });
});


module.exports = router;
