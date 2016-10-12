angular.module('accounts').factory('Accounts', ['$http', '$resource', '$log',
    function($http, $resource, $log) {
        var urlBase = 'api/accounts';
        var myFactory = {};

        myFactory = $resource(urlBase + ':accountId', {
            accountId : '@_id'
        }, {
            get     :   { method : 'GET' },
            query   :   { method : 'GET', isArray : true },
            update  :   { method : 'PUT' }
        });




        return myFactory;
    }
]);