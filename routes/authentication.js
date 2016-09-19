var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');
var app = express();

router.post('/register', function(req, res, next) {
  User.create(req.body).then(function(user) {
    res.json({ success: true });
  });
});

router.post('/login', function(req, res, next) {
  User.findOne({ where: {username: req.body.username} }).then(function(user) {
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      user.authenticate(req.body.password, function(err, isMatch) {
        if (err) throw err;

        console.log(user);
        if (isMatch) {
          var token = jwt.sign(user.dataValues, config.secret, {
            expiresIn: 60*60*24 // expires in 24 hours
          });

          res.json({
            success: true,
            token: token
          });
        } else {
           res.json({ success: false, message: 'Authentication failed. Wrong password.', 'user': user });
        };
      });
    }

  });
});

module.exports = router;
