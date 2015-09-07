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

io.sockets.on('connection', function(socket) {

  socket.emit("user_id", socket.id);

  socket.on("user_joined", function(data) {
    socket.broadcast.emit("user_joined", data, socket.id);
  });

});
