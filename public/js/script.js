'use strict';
$(document).ready(function() {
  var modal = $('#signupModal');
  var saveBtn = $('#save-btn');
  var personsOnline = $('.persons-online');
  var server = 'http://192.168.101.222:7000';
  var status = $('#connection-status');
  var personsName = $('#persons-name');
  var counter = $('#notification-counter');
  var notificationList = $('#notification-list');
  var PlayersOnline = [];
  var PlayRequest = [];

  var updatePlayersOnline = function(users) {
    var html = '';
    var userId = localStorage.getItem('pong-id');
    for (var i in users) {
      if (users.hasOwnProperty(i)) {
        PlayersOnline.push(users[i]);
        var person = users[i];
        if (userId !== person[1]) {
          html += '<a data-name="' + person[0] + '" href="' + person[1] + '" class="online-person list-group-item">' + person[0] + '<i class="fa fa-spinner pull-right"></i> <span class="label label-success pull-right">online</span></a>';
        }
      }
    }
    personsOnline.html(html);
  };

  var updatePlayerRequest = function(players) {
    var length = players.length;
    var html = '';
    if (length > 0) {
      counter.removeClass('label-default').addClass('label-danger').html(length);
    } else {
      counter.removeClass('label-danger').addClass('lable-default').html(length);
    }
    players.forEach(function(person) {
      PlayRequest.push(person.id);
      html += '<li><a class="accept-player-request" href="' + person.id + '">' + person.name + '</a></li>';
      html += '<li class="divider"></li>';
    });
    notificationList.html(html);
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
    socket.on('player_request', updatePlayerRequest);

    $(document).on('click', '.online-person', function(e) {
      e.preventDefault();
      var data = {
        'id': $(this).attr('href'),
        'name': $(this).attr('data-name')
      };
      if (PlayRequest.indexOf(data.id) == -1 && !$(this).hasClass('disabled')) {
        $(this).addClass('disabled');
        socket.emit('request_player', data);
        $(this).find('span').html('requesting').removeClass('label-success').addClass('label-info');
      }
    });

    $(document).on('click', '.accept-player-request', function(e) {
      e.preventDefault();
      var data = {
        'id': $(this).attr('href'),
        'name': $(this).text()
      };
      var verify = confirm('sure you want to play with ' + data.name);
      if (verify === true) {
        socket.emit('player_request_confirmed', data);
      } else {
        socket.emit('player_request_denied', data);
      }
    });

  }

});
