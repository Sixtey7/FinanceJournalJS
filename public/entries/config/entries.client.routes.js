angular.module('entries').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/entries', {
        templateUrl : 'entries/views/view-entries.client.view.html'
      });
  }
]);
