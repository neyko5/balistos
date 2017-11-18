var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors')
var routes = require('./routes');
var server = require('http').Server(app);
var io = require('socket.io')(server, {pingTimeout: 30000});
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

var graphqlHTTP = require('express-graphql');
var schema = require('./data/schema');

app.options('*', cors());
app.use(cors());

io.on('connection', function(socket){
  socket.on('join', function(room){
    socket.join(room);
    console.log("joining ", room)
  });
  socket.on('leave', function(room){
    socket.leave(room);
  });
});

app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

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

app.set('port', process.env.PORT || 4000);
server.listen(process.env.PORT || 4000);
