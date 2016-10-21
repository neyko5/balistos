var express = require('express');
var router = express.Router();
var Chat = require('../models/chat');
var User = require('../models/user');
var jwtauth = require('../middleware/jwtauth');

router.post('/send', jwtauth, function(req, res, next) {
  Chat.create({
    user_id: req.user_id,
    playlist_id: req.body.playlist_id,
    message: req.body.message
  }).then(function(message){
        User.findOne({where:{id: req.user_id}}).then(function(user){
          message.dataValues.user = user.dataValues;
          console.log("emitting to ", "playlist_" + req.body.playlist_id)
          res.io.to("playlist_" + req.body.playlist_id).emit('action', { type: "INSERT_MESSAGE", message: message.dataValues });
          res.json({ success: true });
        });

    });
});

module.exports = router;
