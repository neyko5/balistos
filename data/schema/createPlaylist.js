import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt
  } from 'graphql';

import Playlist from '../../models/playlist';

const PlaylistCreateType = new GraphQLObjectType({
    name: 'PlaylistCreate',
    fields: {
      success: { type: new GraphQLNonNull(GraphQLString) },
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
});

export default {
    type: PlaylistCreateType,
    args: {
      title: {
        name: 'title',
        type: GraphQLString
      },
      description: {
        name: 'description',
        type: GraphQLString
      }
    },
    resolve: async (obj, {title, description}, source, fieldASTs) => {
        if (source.userId) {
            let playlist = await Playlist.create({
                title : title,
                description: description,
                userId: source.userId 
            });
            console.log({ success: true, id: playlist.id });
            return { success: true, id: playlist.id };
        } else {
            throw Error('You do not have permission to create playlist');
        }
    }
}
