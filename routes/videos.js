var express = require('express');
var router = express.Router();
var Video = require('../models/video');
var Playlist = require('../models/playlist');

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
    
});

module.exports = router;
