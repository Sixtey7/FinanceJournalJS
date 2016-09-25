angular.module('account').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.$
            .when('/accounts', {
                templateUrl : 'accounts/views/view-accounts.client.view.html'
            });      
    }
]);