var mainApplicationModuleName = "FinanceJournal";

var mainApplicationModule = angular.module(mainApplicationModuleName,
  ['ngResource', 'ngRoute', 'entries']);

console.log('Inside applicationJS');

mainApplicationModule.config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);

angular.element(document).ready(function() {
  angular.bootstrap(document, [mainApplicationModuleName]);
});
