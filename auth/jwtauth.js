var User = require('../models/user');
var jwt = require('jwt-simple');
var config = require('../config');

module.exports = function(req, res, next) {
  var auth = req.headers.authorization.split(" ");
  var token;

  if(auth.length === 2){
      token = auth[1];
      try {
        var decoded = jwt.decode(token, config.secret);
        if (decoded.exp <= Date.now()) {
          res.end('Access token has expired', 400);
        }
        else{
          req.user_id = decoded.id;
          next()
        }
      } catch (err) {
        next();
      }
  } else {
    next();
  }
};
