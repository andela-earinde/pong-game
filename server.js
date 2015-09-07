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

  socket.on('disconnect', function() {
    delete users[socket.username];
    socket.broadcast.emit('person_left', users);
  });

});
