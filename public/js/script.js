'use strict';
$(document).ready(function() {
  var modal = $('#signupModal');
  var saveBtn = $('#save-btn');
  var server = 'http://192.168.101.222:7000';

  try {
    var socket = io.connect(server);
  } catch (e) {
    console.log(e);
  }

  var username = localStorage.getItem('pong-username');
  if (username === null) {
    modal.modal({
      backdrop: 'static',
      keyboard: false
    });
    modal.modal('show');
  } else {
    socket.emit('user_joined', username);
  }

  saveBtn.on('click', function(e) {
    e.preventDefault();
    var name = $.trim($('#username').val());
    if (name.length > 2) { // use regex later
      localStorage.setItem('pong-username', name);
      username = name;
      modal.modal('hide');
      socket.emit('user_joined', username);
    }
  });

  if (socket !== undefined) {

    socket.on('connect', function(data) {
      console.log('connected to socket server');
    });

    socket.on('user_id', function(user_id) {
      localStorage.setItem('pong-id', user_id);
    });

    socket.on('person_joined', function(username, user_id) {
      console.log(arguments);
    });

  }

});
