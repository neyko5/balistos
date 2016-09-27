var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jwt-simple');
require('dotenv').load();

router.post('/register', function(req, res, next) {
  if(req.body.username && req.body.username.length > 3 && req.body.password && req.body.password.length > 5){
    User.findOne({where: {username: req.body.username}}).then(function(found){
      if (!found){
        User.create(req.body).then(function(user) {
          var token = jwt.encode({
            id: user.dataValues.id,
            username: user.dataValues.username,
            exp: Date.now() + 30*60*60*24*1000,
          }, process.env.SECRET);

          res.json({
            success: true,
            token: token,
            user_id: user.dataValues.id,
            username: user.dataValues.username
          });
        });
      }
      else{
         res.status(400).json({ success: false, message: 'Username is already taken.' });
      }
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid username or password.' });
  }

});

router.post('/login', function(req, res, next) {
  User.findOne({ where: {username: req.body.username}}).then(function(user) {
    if (!user) {
      res.json({ success: false, message: 'Invalid credentials.' });
    } else if (user) {
      user.authenticate(req.body.password, function(err, isMatch) {
        if (err) res.status(401).json({ success: false, message: 'Invalid credentials.'});
        if (isMatch) {
          var token = jwt.encode({
            id: user.dataValues.id,
            username: user.dataValues.username,
            exp: Date.now() + 30*60*60*24*1000,
          }, process.env.SECRET);

          res.json({
            success: true,
            token: token,
            user_id: user.dataValues.id,
            username: user.dataValues.username
          });
        } else {
           res.json({ success: false, message: 'Invalid credentials.' });
        };
      });
    }
  });
});


module.exports = router;
