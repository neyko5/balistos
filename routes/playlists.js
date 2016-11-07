var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var Playlist = require('../models/playlist');
var PlaylistVideo = require('../models/playlistVideo');
var PlaylistUser = require('../models/playlistUser');
var Video = require('../models/video');
var User = require('../models/user');
var Chat = require('../models/chat');
var Like = require('../models/like');
var jwtauth = require('../middleware/jwtauth');

router.get('/search', function(req, res, next) {
  Playlist.findAll({ where: {
    $or: [
      {
        title: {
          $like: '%' + req.query.q + '%'
        }
      },
      {
        description: {
          $like: '%' + req.query.q + '%'
        }
      }
    ]
  }, limit: 10 , include: [{model: User, attributes: ['username']}, {model: PlaylistVideo, include: [Video]}]})
  .then(function(playlists) {
    res.json(playlists);
  });
});

router.get('/', function(req, res, next) {
  Playlist.findAll({limit: 10 , include: [{model: User, attributes: ['username']}, {model: PlaylistVideo, include: [Video]}]})
      .then(function(playlists) {
        res.json(playlists);
      });
});

router.post('/heartbeat', jwtauth, function(req, res, next) {
  PlaylistUser.findOrCreate({ where: { username: req.body.username, playlist_id: req.body.playlist_id }}).spread(function(result, created) {
    PlaylistUser.update(
        { updated_at: null },
        {where: { username: req.body.username, playlist_id: req.body.playlist_id }}
    ).then(function(response){
        PlaylistUser.findAll({where: { playlist_id: req.body.playlist_id, updated_at: {gt: (new Date() - 60000)}}, attributes: ['username']}).then(function(results) {
          res.json(results);
        });
    });
  });
});

router.get('/users/:playlist_id', function(req, res, next) {
  PlaylistUser.findAll({where: { playlist_id: req.params.playlist_id, updated_at: {gt: (new Date() - 60000)}}, attributes: ['username']}).then(function(results) {
    res.json(results);
  });
});

router.get('/:playlist_id', function(req, res, next) {
  Playlist.findOne({where: {id: req.params.playlist_id},
    include: [
      {model: PlaylistVideo, include:[
        {model: Video},
        {model: Like, include: {model: User, attributes: ['username']}},
        {model: User, attributes: ['username']}
      ], where: {active: 1}, required: false},
      {model: User, attributes: ['username']},
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
  }).then(function(playlist) {
    res.json({ success: true, id: playlist.id });
  });
});

module.exports = router;
