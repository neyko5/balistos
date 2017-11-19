import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
  } from 'graphql';
import { getPlaylistsSchema, getPlaylistSchema, getPlaylistUsersSchema, searchPlaylistSchema, heartbeatSchema, createPlaylistSchema } from './playlistSchema.js';
import { createChatSchema } from './chatSchema.js';
import { loginSchema, registerSchema, verifyTokenSchema } from './authenticationSchema.js';
import { addVideoSchema, likeVideoSchema, finishVideoSchema, startVideoSchema, deleteVideoSchema } from './videoSchema.js';


var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      getPlaylists: getPlaylistsSchema,
      getPlaylist: getPlaylistSchema,
      getPlaylistUsers: getPlaylistUsersSchema,
      searchPlaylist: searchPlaylistSchema,
      login: loginSchema,
      verifyToken: verifyTokenSchema
    },

  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createPlaylist: createPlaylistSchema,
      createChat: createChatSchema,
      addVideo: addVideoSchema,
      likeVideo: likeVideoSchema,
      finishVideo: finishVideoSchema,
      startVideo: startVideoSchema,
      deleteVideo: deleteVideoSchema,
      heartbeat: heartbeatSchema,
      register: registerSchema
    }
  })
});
  
module.exports = schema;