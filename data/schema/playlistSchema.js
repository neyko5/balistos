import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean
  } from 'graphql';

import sequelize from '../../database';

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

export const getPlaylistSchema = {
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

const PlaylistWithCount = new GraphQLObjectType({
    name: 'PlaylistWithCount',
    fields: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      count: { type: new GraphQLNonNull(GraphQLInt) },
      username: { type: new GraphQLNonNull(GraphQLString) }
    },
});

const PlaylistSimple = new GraphQLObjectType({
    name: 'PlaylistSimple',
    fields: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      user: { type: new GraphQLNonNull(UserType) }
    },
});


export const getPlaylistsSchema = {
    type: new GraphQLList(PlaylistWithCount),
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

export const getPlaylistUsersSchema = {
    type: new GraphQLList(UserType),
    args: {
        playlistId: {
          name: 'playlistId',
          type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async (root, {playlistId}, source) => {
        let playlistUsers = await PlaylistUser.findAll({
            where: { playlistId: playlistId, updatedAt: {gt: (new Date() - 60000)}}, 
            attributes: ['username']});
        return playlistUsers;
    }
}

export const searchPlaylistSchema = {
    type: new GraphQLList(PlaylistSimple),
    args: {
        query: {
          name: 'query',
          type: GraphQLString
        }
    },
    resolve: async (root, {query}, source) => {
        let playlists = await Playlist.findAll({ where: {
            $or: [
              {
                title: {
                  $like: '%' + query + '%'
                }
              },
              {
                description: {
                  $like: '%' + query + '%'
                }
              }
            ]
        }, limit: 10 , include: [{model: User, attributes: ['username']}]})
        return playlists;
    }
}

export const heartbeatSchema = {
    type: new GraphQLList(UserType),
    args: {
        username: {
          name: 'username',
          type: GraphQLString
        },
        playlistId: {
            name: 'playlistId',
            type: GraphQLString
          }
    },
    resolve: async (root, {username, playlistId}, source) => {
        const [playlistUser, created] = await PlaylistUser.findOrCreate({ 
            where: { username: username, 
                     playlistId: playlistId 
            }});
        const update = await PlaylistUser.update(
            { updatedAt: null },
            {where: { username: username, playlistId: playlistId }});
        const playlistUsers = await PlaylistUser.findAll({
            where: { playlistId: playlistId, 
                     updatedAt: {gt: (new Date() - 60000)}}, 
                     attributes: ['username']});
        return playlistUsers;
    }
}

const PlaylistCreateType = new GraphQLObjectType({
    name: 'PlaylistCreate',
    fields: {
      success: { type: new GraphQLNonNull(GraphQLString) },
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
});

export const createPlaylistSchema = {
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
            return { success: true, id: playlist.id };
        } else {
            throw Error('You do not have permission to create playlist.');
        }
    }
}