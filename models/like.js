import sequelize from '../database';
import Sequelize from 'sequelize';
import User from './user';

var Like = sequelize.define('likes', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  value: {
    type: Sequelize.INTEGER,
    field: 'value'
  },
}, {
  tableName: 'likes'
});

Like.belongsTo(User);

Like.getLikeWithUser = async (id) => {
  return Like.findOne({ where: {id: id}, include: [{model: User, attributes: ['username']}]})
}

module.exports = Like;
