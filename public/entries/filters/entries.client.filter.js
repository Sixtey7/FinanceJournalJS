var module = angular.module('entries');

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
module.filter('formatDate', function() {
  return function(date) {
    console.log('Formatting Date...');
    if (date) {
      //TODO: May want to clean this up a bit to make the date even prettier
      var splitResults = date.split('T');
      return splitResults[0];
    }
    else {
      return date;
    }
  }
})
