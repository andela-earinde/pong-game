'use strict';
$(document).ready(function() {
  var socket = io('http://localhost:7000');

  socket.on('connect', function() {
    console.log('connected to socket server');
  });

  var modal = $('#signupModal');
  var saveBtn = $('#save-btn');
  modal.modal({
    backdrop: 'static',
    keyboard: false
  });
  modal.modal('show');

  saveBtn.on('click', function(e) {
    e.preventDefault();
    modal.modal('hide');
  });

});
