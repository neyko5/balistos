var {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');

var Video = require('../../models/video');
var User = require('../../models/user');
var Like = require('../../models/like');
var PlaylistVideo = require('../../models/playlistVideo');

const VideoResponseType = new GraphQLObjectType({
  name: 'VideoResponse',
  fields: {
    success: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const addVideoSchema = {
  type: VideoResponseType,
  args: {
    youtubeId: {
      name: 'youtubeId',
      type: GraphQLString
    },
    title: {
      name: 'title',
      type: GraphQLString
    },
    playlistId: {
      name: 'playlistId',
      type: GraphQLInt
    },
    autoAdded: {
      name: 'autoAdded',
      type: GraphQLBoolean
    }
  },
  resolve: async (obj, {youtubeId, title, autoAdded, playlistId}, source, fieldASTs) => {
      if (source.userId) {
          const [video, created] = await Video.findOrCreate({
            where: { youtubeId: youtubeId},
            defaults: { title: title }
          });
          const playlistVideo = await PlaylistVideo.create({
            userId: source.userId,
            playlistId: playlistId,
            videoId: video.id,
            active: 1,
            autoAdded: autoAdded
          });
          const fullVideoResource = await PlaylistVideo.getFullModel(playlistVideo.id);
          source.io.to("playlist_" + playlistId).emit('action', { type: "INSERT_VIDEO", video: fullVideoResource });
          return {success: true};
      } else {
          throw Error('You do not have permission to add video.');
      }
  }
}

const likeVideoSchema = {
  type: VideoResponseType,
  args: {
    videoId: {
      name: 'videoId',
      type: GraphQLInt
    },
    value: {
      name: 'value',
      type: GraphQLInt
    }
  },
  resolve: async (obj, {videoId, value}, source, fieldASTs) => {
      if (source.userId) {
          const [like, created] = await Like.findOrCreate({
            where: { playlistVideoId: videoId, userId: source.userId},
          });
          const result = await like.update({value: value });
          const fullLikeResource = await Like.getLikeWithUser(like.id);
          const playlistVideo = await PlaylistVideo.findById(videoId);
          source.io.to("playlist_" + playlistVideo.playlistId).emit('action', { type: "UPDATE_OR_INSERT_LIKE", like: fullLikeResource });
          return {success: true};
      } else {
          throw Error('You do not have permission to like video.');
      }
  }
}

const finishVideoSchema = {
  type: VideoResponseType,
  args: {
    videoId: {
      name: 'videoId',
      type: GraphQLInt
    },
  },
  resolve: async (obj, {videoId}, source, fieldASTs) => {
      if (source.userId) {
          const video = await PlaylistVideo.findOne({where: {id: videoId}})
          await video.update({active: 0});
          source.io.to("playlist_" + video.playlistId).emit('action', {type: "DEACTIVATE_VIDEO", videoId: video.id});
          return {success: true};
      } else {
          throw Error('You do not have permission to finish video.');
      }
  }
}

const startVideoSchema = {
  type: VideoResponseType,
  args: {
    videoId: {
      name: 'videoId',
      type: GraphQLInt
    },
  },
  resolve: async (obj, {videoId}, source, fieldASTs) => {
      if (source.userId) {
          const video = await PlaylistVideo.findOne({where: {id: videoId}});
          if (video && !video.startedAt) {
            await video.update({startedAt: new Date()});
            return {success: true};
          }
      } else {
          throw Error('You do not have permission to start video.');
      }
  }
}

const deleteVideoSchema = {
  type: VideoResponseType,
  args: {
    videoId: {
      name: 'videoId',
      type: GraphQLInt
    },
  },
  resolve: async (obj, {videoId}, source, fieldASTs) => {
      if (source.userId) {
          const video = await PlaylistVideo.findOne({where: {id: videoId}})
          if (video) {
            await video.destroy();
            source.io.to("playlist_" + video.playlistId).emit('action', {type: "REMOVE_VIDEO", videoId: video.id});
            return {success: true};
          } else {
            throw Error('Video does not exist');
          }
          
      } else {
          throw Error('You do not have permission to finish video.');
      }
  }
}

module.exports = {
  addVideoSchema,
  likeVideoSchema,
  finishVideoSchema,
  startVideoSchema,
  deleteVideoSchema
}