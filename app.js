var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors')
var routes = require('./routes');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PlaylistUser = require('./models/playlistUser');
require('dotenv').config()

app.options('*', cors());
app.use(cors());

io.on('connection', function(socket){
  socket.on('join', function(room){
    socket.join("playlist_" + room.playlist);
    PlaylistUser.findOrCreate({where: {playlist_id: room.playlist, username: room.username}}).spread((playlistUser, created) => {
       playlistUser.increment({
          'count': 1
        });
        if(!playlistUser.dataValues.count || playlistUser.dataValues.count === 0) {
          io.to("playlist_" + room.playlist).emit('action', { type: "ADD_USER", user: {username: room.username}});
        }
    });
  });
  socket.on('leave', function(room){
    socket.leave("playlist_" + room.playlist);
    PlaylistUser.findOne({ where: {playlist_id: room.playlist, username: room.username}, limit: 1}).then((playlistUser) => {
      playlistUser.decrement({
         'count': 1
       });
       if(playlistUser.dataValues.count < 2) {
         io.to("playlist_" + room.playlist).emit('action', { type: "REMOVE_USER", user: {username: room.username}});
       }
    });
  });
});

app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    return res.send(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  return res.send(err);
});

app.set('port', 3000);
server.listen(3000);
