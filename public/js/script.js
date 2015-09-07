'use strict';
$(document).ready(function() {
  var socket;
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

  if (username !== null) {
    try {
      socket = io.connect('http://localhost:7000');
    } catch (e) {
      console.log(e);
    }
  }

  socket.on('connect', function(data) {
    console.log('connected to socket server');
    socket.emit('user_joined', username);
  });


});
