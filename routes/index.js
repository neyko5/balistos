var express = require('express');
var playlists = require('./playlists');
var videos = require('./videos');
var chats = require('./chats');
var authentication = require('./authentication');

const app = express();
const router = express.Router();

app.use('/playlists', playlists);
app.use('/videos', videos);
app.use('/authentication', authentication);
app.use('/chat', chats);

module.exports = app;
