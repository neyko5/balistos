var express = require('express');

var Sequelize = require('sequelize');
var Playlist = require('../models/playlist');
var PlaylistVideo = require('../models/playlistVideo');
var PlaylistUser = require('../models/playlistUser');
var Video = require('../models/video');
var User = require('../models/user');
var Chat = require('../models/chat');
var Like = require('../models/like');
var jwtauth = require('../middleware/jwtauth');
var sequelize = require('../database');

const router = express.Router();

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
  }, limit: 10 , include: [{model: User, attributes: ['username']}]})
  .then(function(playlists) {
    res.json(playlists);
  });
});

router.get('/', function(req, res, next) {
    sequelize.query(`SELECT playlists.id, playlists.title, playlists.description, users.username, COUNT(playlistVideos.videoId) as count 
                     from users, playlists, playlistVideos 
                     WHERE users.id = playlists.userId AND playlists.id = playlistVideos.playlistId 
                     GROUP BY playlists.id 
                     ORDER BY count DESC`, 
                     { type: sequelize.QueryTypes.SELECT})
        .then(function(playlists) {
            res.json(playlists);
        })
});

router.post('/heartbeat', jwtauth, function(req, res, next) {
  PlaylistUser.findOrCreate({ 
      where: { username: req.body.username, 
               playlistId: req.body.playlistId 
      }})
      .spread(function(result, created) {
    PlaylistUser.update(
        { updatedAt: null },
        {where: { username: req.body.username, playlistId: req.body.playlistId }}
    ).then(function(response){
        PlaylistUser.findAll({
          where: { playlistId: req.body.playlistId, 
                   updatedAt: {gt: (new Date() - 60000)}}, 
                   attributes: ['username']})
        .then(function(results) {
          res.json(results);
        });
    });
  });
});

router.get('/users/:playlistId', function(req, res, next) {
  PlaylistUser.findAll({
    where: { playlistId: req.params.playlistId, updatedAt: {gt: (new Date() - 60000)}}, 
    attributes: ['username']})
  .then(function(results) {
    res.json(results);
  });
});

router.get('/:playlistId', function(req, res, next) {
  Playlist.findOne({where: {id: req.params.playlistId},
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
    userId: req.userId
  }).then(function(playlist) {
    res.json({ success: true, id: playlist.id });
  });
});

module.exports = router;
