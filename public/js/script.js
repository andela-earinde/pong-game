'use strict';
$(document).ready(function() {
  var modal = $('#signupModal');
  var saveBtn = $('#save-btn');
  var personsOnline = $('.persons-online');
  var server = 'http://192.168.101.222:7000';
  var status = $('#connection-status');
  var personsName = $('#persons-name');

  var updatePlayersOnline = function(users) {
    var html = '';
    var userId = localStorage.getItem('pong-id');
    for (var i in users) {
      if (users.hasOwnProperty(i)) {
        var person = users[i];
        if (userId !== person[1]) {
          html += '<a href="' + person[1] + '" class="list-group-item">' + person[0] + '<i class="fa fa-spinner pull-right"></i> <span class="label label-success pull-right">online</span></a>';
        }
      }
    }
    personsOnline.html(html);
  };

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
    personsName.html(username);
  }

  saveBtn.on('click', function(e) {
    e.preventDefault();
    var name = $.trim($('#username').val());
    if (name.length > 2) { // use regex later
      localStorage.setItem('pong-username', name);
      username = name;
      modal.modal('hide');
      socket.emit('user_joined', username);
      personsName.html(username);
    }
  });

  if (socket !== undefined) {

    socket.on('connect', function(data) {
      status.html('Online').removeClass('label-default').addClass('label-success');
      console.log('connected to socket server');
    });

    socket.on('disconnect', function() {
      status.html('Offline').removeClass('label-success').addClass('label-default');
      console.log('disconnected from server');
    });

    socket.on('user_id', function(user_id) {
      localStorage.setItem('pong-id', user_id);
    });

    socket.on('person_joined', updatePlayersOnline);
    socket.on('person_left', updatePlayersOnline);

  }

});
