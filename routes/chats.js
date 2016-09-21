var express = require('express');
var router = express.Router();
var Chat = require('../models/chat');
var User = require('../models/user');
var jwtauth = require('../auth/jwtauth');

/* GET home page. */
router.get('/', function(req, res, next) {
  Chat.findAll({include: [{model: User, attributes: ['username']}]})
    .then(function(chats) {
      console.log("STT");
      res.json(chats);
    });
});

router.post('/send', jwtauth, function(req, res, next) {
  Chat.create({
    user_id: req.user_id,
    playlist_id: req.body.playlist_id,
    message: req.body.message
  },{isNewRecord: true}).then(function(message){
      User.findOne({where:{id: req.user_id}}).then(function(user){
      message.dataValues.user = user.dataValues;
      console.log("MESSAGE", message.dataValues);
      console.log("emmiting message to: " + req.body.playlist_uri);
      res.io.to(req.body.playlist_uri).emit('action', { type: "INSERT_MESSAGE", message: message.dataValues });
      res.json({ success: true });
    });

  });
});

module.exports = router;
