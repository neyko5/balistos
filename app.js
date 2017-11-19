import express from 'express';
import path  from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import routes from './routes';
import socketio from 'socket.io';
import sequelize from'./database';
import jwt from 'express-jwt';

const app = express();
const server = http.Server(app);
const io = socketio(server, {pingTimeout: 30000});



import graphqlHTTP  from 'express-graphql';
import schema from './data/schema';

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

app.use('/graphql', jwt({
  secret: process.env.SECRET,
  requestProperty: 'auth',
  credentialsRequired: false,
}));

app.use('/graphql', function(req, res, done) {
  if (req.auth && req.auth.exp >= Date.now()) {
    req.context = {
      userId: req.auth.id,
      username: req.auth.username
    }
  }
  done();
});

app.use('/graphql', graphqlHTTP(req => ({
    schema: schema,
    context: req.context,
    graphiql: true
  })
));

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