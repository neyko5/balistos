var vogels = require('vogels');
var bcrypt = require('bcrypt');
var Joi = require('joi');

vogels.AWS.config.loadFromPath('credentials.json');

var User = vogels.define("User", {
  hashKey : 'username',
  tableName: 'User',
  schema : {
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string()
  }
});

User.before('create', function(data, next) {
  if (!data.password) return next();
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(data.password, salt, function(err, hash) {
      if (err) return next(err);
      data.password = hash;
      next(null, data);
    });
  });
});

User.prototype.authenticate = function(password, callback) {
   bcrypt.compare(password, this.attrs.password, function(err, isMatch) {
     callback(null, isMatch);
   });
 };

module.exports = User;
