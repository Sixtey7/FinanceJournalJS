var module = angular.module('entries');

var MONTH_NAMES = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

/**
* Filter used to take the absolute value of a number
**/
module.filter('abs', function() {
  return function(input) {
    return Math.abs(input);
  }
});

/**
* Filter used to format currency to two decimal places
**/
module.filter('currency', function() {
  return function(input) {
    if (input) {
      return input.toFixed(2);
    }
    else {
      return "";
    }
  }
})

/**
* Filter used to make the date prettier on the ui
**/
module.filter('formatDate', ['$log', function($log) {
  return function(date) {
    $log.debug('Formatting Date...');
    if (date) {
      //TODO: May want to clean this up a bit to make the date even prettier
      var dateObj = new Date(date);

      return MONTH_NAMES[dateObj.getMonth()] + ' ' + dateObj.getDate();

    }
    else {
      return date;
    }
  }
}])
