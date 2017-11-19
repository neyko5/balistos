import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt
  } from 'graphql';

import Chat from '../../models/chat';

const ChatCreateType = new GraphQLObjectType({
    name: 'ChatCreate',
    fields: {
      success: { type: new GraphQLNonNull(GraphQLString) },
    },
});

export const createChatSchema = {
    type: ChatCreateType,
    args: {
      message: {
        name: 'message',
        type: GraphQLString
      },
      playlistId: {
        name: 'playlistId',
        type: GraphQLString
      }
    },
    resolve: async (obj, {message, playlistId}, source, fieldASTs) => {
        if (source.userId) {
            let msg = await Chat.create({
                message: message,
                playlistId: playlistId,
                userId: source.userId
            });
            msg.dataValues.user = {
                username: source.username,
                id: source.userId
            };
            source.io.to("playlist_" + playlistId).emit('action', { type: "INSERT_MESSAGE", message: msg.dataValues });
            return { success: true };
        } else {
            throw Error('You do not have permission to send chat message.');
        }
    }
}
