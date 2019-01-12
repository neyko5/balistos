var {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
  } = require('graphql');
var { getPlaylistsSchema, getPlaylistSchema, getPlaylistUsersSchema, searchPlaylistSchema, heartbeatSchema, createPlaylistSchema } = require('./playlistSchema.js');
var { createChatSchema } = require('./chatSchema.js');
var { loginSchema, registerSchema, verifyTokenSchema } = require('./authenticationSchema.js');
var { addVideoSchema, likeVideoSchema, finishVideoSchema, startVideoSchema, deleteVideoSchema } = require('./videoSchema.js');


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