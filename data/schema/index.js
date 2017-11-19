import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
  } from 'graphql';
import playlistsSchema from './playlists.js';
import playlistSchema from './playlist.js';
import createPlaylistSchema from './createPlaylist.js';



var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      playlists: playlistsSchema,
      playlist: playlistSchema
    },

  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createPlaylist: createPlaylistSchema
    }
  })
});
  
module.exports = schema;