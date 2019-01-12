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
  tableName: 'users'
});

User.prototype.authenticate = function(password) {
  return bcrypt.compare(password, this.password);
}

User.beforeCreate((user, options) => {
  return bcrypt.genSalt(5)
    .then((salt) => {
      return bcrypt.hash(user.password, salt);
  }).then((hash) => {
      user.password = hash;
      return options;
  }).catch((err) => {
    return err;
  });
})

module.exports = User;
