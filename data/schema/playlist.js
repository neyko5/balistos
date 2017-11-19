import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean
  } from 'graphql';

import PlaylistVideo from '../../models/playlistVideo';
import PlaylistUser from '../../models/playlistUser';
import Video from '../../models/video';
import User from '../../models/user';
import Chat from '../../models/chat';
import Like from '../../models/like';
import Playlist from '../../models/playlist';

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      username: { type: new GraphQLNonNull(GraphQLString) }
    }
});

const LikeType = new GraphQLObjectType({
    name: 'Like',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        value: { type: new GraphQLNonNull(GraphQLInt) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        user: { 
            type: UserType,
            resolve: (like) => {
                let user = User.findOne({where: {id: like.userId}});
                return user;
            } 
        },
    }
});

const VideoType = new GraphQLObjectType({
    name: 'Video',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        youtubeId: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

const ChatType = new GraphQLObjectType({
    name: 'Chat',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        message: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        user: { 
            type: UserType,
            resolve: (playlistVideo) => {
                let user = User.findOne({where: {id: playlistVideo.userId}});
                return user;
            } 
        },
    }),
});

const PlaylistVideoType = new GraphQLObjectType({
    name: 'PlaylistVideo',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        playlistId: { type: new GraphQLNonNull(GraphQLString) },
        active: { type: new GraphQLNonNull(GraphQLBoolean) },
        startedAt: { type: new GraphQLNonNull(GraphQLInt) },
        autoAdded: { type: new GraphQLNonNull(GraphQLBoolean) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        likes: { 
            type: new GraphQLList(LikeType),
            resolve: (playlistVideo) => {
                let likes = Like.findAll({where: {playlistVideoId: playlistVideo.id}});
                return likes;
            } 
        },
        user: { 
            type: UserType,
            resolve: (playlistVideo) => {
                let user = User.findOne({where: {id: playlistVideo.userId}});
                return user;
            } 
        },
        video: { 
            type: VideoType,
            resolve: (playlistVideo) => {
                let video = Video.findOne({where: {id: playlistVideo.videoId}});
                return video;
            } 
        },
    }),
});


const PlaylistType = new GraphQLObjectType({
    name: 'Playlist',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        playlistVideos: { 
            type: new GraphQLList(PlaylistVideoType),
            resolve: (playlist) => {
                let videos = PlaylistVideo.findAll({where: {playlistId: playlist.id, active: true}});
                return videos;
            } 
        },
        user: { 
            type: UserType,
            resolve: (playlist) => {
                let user = User.findOne({where: {id: playlist.userId}});
                return user;
            } 
        },
        chats: { 
            type: new GraphQLList(ChatType),
            resolve: (playlist) => {
                let chats = Chat.findAll({where: {playlistId: playlist.id}});
                return chats;
            } 
        },
    }
});

export default {
    type: PlaylistType,
    args: {
        id: {
          name: 'id',
          type: new GraphQLNonNull(GraphQLInt)
        }
    },
    async resolve(root, args) {
        let playlist = await Playlist.findOne({where: {id: args.id}});
        return playlist;
    }
}
