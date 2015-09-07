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

io.sockets.on('connection', function(socket) {

  socket.emit("user_id", socket.id);

  socket.on("user_joined", function(username) {
    socket.username = username;
    users[username] = [username, socket.id];
    socket.broadcast.emit("person_joined", users);
  });

  socket.on("disconnect", function() {
    delete users[socket.username];
    socket.broadcast.emit("person_left", users);
  });

});
