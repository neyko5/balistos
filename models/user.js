var sequelize = require('../database');
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

var User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    field: 'username'
  },
  email: {
    type: Sequelize.STRING,
    field: 'email'
  },
  password: {
    type: Sequelize.STRING,
    field: 'password'
  },
}, {
  tableName: 'users',
  instanceMethods: {
		authenticate: function(password, callback) {
      bcrypt.compare(password, this.password, function(err, isMatch) {
        callback(null, isMatch);
      });
    }
	}
});

User.beforeCreate(function(user, options, callback) {
  console.log(options);
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return err;
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      callback(null, options);
    });
  });
})

/*
User.prototype.authenticate = function(password, callback) {

 };
*/
module.exports = User;
