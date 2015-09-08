'use strict';

var express = require('express');
var app = express();
var config = {
  port: process.env.PORT || 7000
};

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('./public/index.html');
});

var server = app.listen(config.port, function() {
  console.log('Pong Game server running on port ' + config.port);
});

var io = require('socket.io').listen(server);

var users = {};
var request = {};

io.sockets.on('connection', function(socket) {

  socket.on('user_joined', function(username) {
    socket.emit('user_id', socket.id);
    socket.username = username;
    users[username] = [username, socket.id];
    io.sockets.emit("person_joined", users);
  });

  socket.on('request_player', function(data) {
    if(request[data.name]) {
      request[data.name].push({id:socket.id,
                              name: socket.username});
    }
    else {
      request[data.name] = [];
      request[data.name].push({id:socket.id,
                              name: socket.username});
    }
    socket.broadcast.to(data.id).emit('player_request', request[data.name]);
  });

  socket.on('player_request_confirmed', function(data) {
    var room = data.name+'_'+socket.username;
    socket.join(room);
    delete request[socket.username]
    socket.broadcast.to(data.id).emit('room_created', room);
    socket.broadcast.to(data.id).emit('player_request', []);
  });

  socket.on('join_room', function(roomName) {
    socket.join(roomName);
    io.sockets.to(roomName).emit('game_on', roomName);
  });

  socket.on('player_request_denied', function(data) {
    for (var i in request[socket.username]) {
      if(request[socket.username][i].id === data.id) {
        delete request[socket.username][i];
      }
    }
    socket.broadcast.to(data.id).emit('player_request', request[socket.username]);
  });

  socket.on('disconnect', function() {
    delete users[socket.username];
    socket.broadcast.emit('person_left', users);
  });

});
