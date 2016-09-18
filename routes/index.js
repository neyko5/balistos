var express = require('express');
var router = express.Router();
var Video = require('../models/video');

/* GET home page. */
router.get('/', function(req, res, next) {
  Video.find(function(err, videos) {
    if (err) {
      return res.send(err);
    }

    res.json(videos);
  });
});

router.get('/add', function(req, res, next) {
  var video = new Video({title: "Life is strange", youtube_id: "Bh1Pr6ef_XI"});
  video.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ message: 'Movie Added' });
  });
});

module.exports = router;
