var sequelize = require('../database');
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

var User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    field: 'username'
  },
  password: {
    type: Sequelize.STRING,
    field: 'password'
  },
}, {
  tableName: 'users',
  underscored: true,
  instanceMethods: {
		authenticate: function(password, callback) {
      bcrypt.compare(password, this.password, function(err, isMatch) {
        callback(null, isMatch);
      });
    }
	}
});

User.beforeCreate(function(user, options, callback) {
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return err;
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      callback(null, options);
    });
  });
})

module.exports = User;
