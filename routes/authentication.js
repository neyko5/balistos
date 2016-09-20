var express = require('express');
var router = express.Router();
var User = require('../models/user');
var config = require('../config');
var app = express();
var jwt = require('jwt-simple');

router.post('/register', function(req, res, next) {
  User.create(req.body).then(function(user) {
    res.json({ success: true });
  });
});

router.post('/login', function(req, res, next) {
  User.findOne({ where: {username: req.body.username}}).then(function(user) {
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      user.authenticate(req.body.password, function(err, isMatch) {
        if (err) throw err;

        console.log(user);
        if (isMatch) {
          var token = jwt.encode({
            id: user.dataValues.id,
            exp: Date.now() + 7*60*60*24,
          }, config.secret);

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
