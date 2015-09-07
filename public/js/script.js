'use strict';

$(document).ready(function() {

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
