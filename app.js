var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors')
var routes = require('./routes/index');
var playlists = require('./routes/playlists');
var videos = require('./routes/videos');
var chats = require('./routes/chats');
var authentication = require('./routes/authentication');
var config = require('./config');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.options('*', cors());
app.use(cors());

io.on('connection', function(socket){
  socket.on('join', function(room){
    console.log("user is joining " + room);
    socket.join(room);
  });
  socket.on('leave', function(room){
    console.log("user is leaving " + room);
    socket.leave(room);
  });
});

app.use(function(req, res, next){
  res.io = io;
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);
app.use('/playlists', playlists);
app.use('/videos', videos);
app.use('/authentication', authentication);
app.use('/chat', chats);



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


module.exports = {app: app, server: server};
