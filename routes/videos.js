var express = require('express');
var router = express.Router();
var Video = require('../models/video');
var Playlist = require('../models/playlist');
var PlaylistVideo = require('../models/playlistVideo');

/* GET home page. */
router.get('/', function(req, res, next) {
  Video.find(function(err, videos) {
    if (err) {
      return res.send(err);
    }

    res.json(videos);
  });
});

router.post('/add', function(req, res, next) {
  Video.findOrCreate({youtube_id: req.body.youtube_id}, function(err, video, created){
    Playlist.findOne(function(err, playlist) {
      if (err) {
        return res.send(err);
      }
      PlaylistVideo.create({video: video._id, playlist: playlist._id}, function(err, pl){
        if (err) {
          return res.send(err);
        }
        playlist.videos.push(pl._id);
        playlist.save();

        res.json(pl);
      });
    });
  });
});

module.exports = router;
