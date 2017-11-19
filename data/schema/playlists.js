import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLList
  } from 'graphql';
import sequelize from'../../database';

const Playlists = new GraphQLObjectType({
    name: 'Playlists',
    fields: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      count: { type: new GraphQLNonNull(GraphQLInt) },
      username: { type: new GraphQLNonNull(GraphQLString) }
    },
});

export default {
    type: new GraphQLList(Playlists),
    async resolve(root, args) {
        let items = await sequelize.query(`SELECT playlists.id, playlists.title, playlists.description, users.username, COUNT(playlistVideos.videoId) as count 
            FROM users, playlists, playlistVideos 
            WHERE users.id = playlists.userId AND playlists.id = playlistVideos.playlistId 
            GROUP BY playlists.id 
            ORDER BY count DESC`, 
            { type: sequelize.QueryTypes.SELECT});
        return items;
    }
}
