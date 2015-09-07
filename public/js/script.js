'use strict';
$(document).ready(function() {
  var socket = io.connect('http://localhost:7000');
  var modal = $('#signupModal');
  var saveBtn = $('#save-btn');

  var username = localStorage.getItem('pong-username');
  if (username === null) {
    modal.modal({
      backdrop: 'static',
      keyboard: false
    });
    modal.modal('show');
  }

  saveBtn.on('click', function(e) {
    e.preventDefault();
    var name = $.trim($('#username').val());
    if (name.length > 2) { // use regex later
      localStorage.setItem('pong-username', name);
      username = name;
      modal.modal('hide');
    }
  });

  socket.on('connect', function(data) {
    console.log('connected to socket server');
  });

  socket.on('user_id', function(user_id) {
    localStorage.setItem('pong-id', user_id);
    socket.emit('user_joined', username);
  });

  socket.on('person_joined', function(username, user_id) {
    console.log('person joined ' + arguments);
  });

});
