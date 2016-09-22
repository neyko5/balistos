var express = require('express');
var router = express.Router();
var playlists = require('./playlists');
var videos = require('./videos');
var chats = require('./chats');
var authentication = require('./authentication');
var app = express();

app.use('/playlists', playlists);
app.use('/videos', videos);
app.use('/authentication', authentication);
app.use('/chat', chats);

module.exports = app;
