var User = require('../models/user');
var jwt = require('jwt-simple');
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').load();
}


module.exports = function(req, res, next) {
  if(req.headers && req.headers.authorization){
    var auth = req.headers.authorization.split(" ");
    var token;

    if(auth.length === 2){
        token = auth[1];
        try {
          var decoded = jwt.decode(token, process.env.SECRET);
          if (decoded.exp <= Date.now()) {
            res.end('Access token has expired', 403);
          }
          else{
            req.user_id = decoded.id;
            req.username
            next()
          }
        } catch (err) {
          return res.send(403);
        }
    } else {
      return res.send(403);
    }
  }
  else{
    return res.send(403);
  }

};
