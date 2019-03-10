var express = require('express');

var Chat  = require('../models/chat');
var User = require('../models/user');
var jwtauth = require('../middleware/jwtauth');

const router = express.Router();

router.post('/send', jwtauth, function(req, res, next) {
  Chat.create({
    userId: req.userId,
    playlistId: req.body.playlistId,
    message: req.body.message
  }).then(function(message){
        User.findOne({where:{id: req.userId}}).then(function(user){
          message.dataValues.user = user.dataValues;
          res.io.to("playlist_" + req.body.playlistId).emit('action', { type: "INSERT_MESSAGE", message: message.dataValues });
          res.status(201).json({ success: true, message: 'Chat message was successfully submitted' });
        });

    });
});

module.exports = router;
