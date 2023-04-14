/* HTML references */
var controller = $('#controller').data('controller');
var action = $('#action').data('action');
var urlbase = $('#urlbase').data('urlbase');

// Toastr options
toastr.options = {
  'closeButton': true,
  'debug': false,
  'newestOnTop': true,
  'progressBar': true,
  'positionClass': 'toast-top-right',
  'preventDuplicates': true,
  'onclick': null,
  'showDuration': '300',
  'hideDuration': '1000',
  'timeOut': '4000',
  'extendedTimeOut': '1000',
  'showEasing': 'swing',
  'hideEasing': 'linear',
  'showMethod': 'fadeIn',
  'hideMethod': 'fadeOut'
}

