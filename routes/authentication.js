var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jwt-simple');
require('dotenv').load();

router.post('/register', function(req, res, next) {
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
});

router.post('/login', function(req, res, next) {
  User.findOne({ where: {username: req.body.username}}).then(function(user) {
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      user.authenticate(req.body.password, function(err, isMatch) {
        if (err) res.json({ success: false, message: 'Authentication failed. Wrong password.', 'user': user });
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
           res.json({ success: false, message: 'Authentication failed. Wrong password.', 'user': user });
        };
      });
    }
  });
});


module.exports = router;
