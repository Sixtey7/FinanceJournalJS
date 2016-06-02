angular.module('entries').factory('Entries', ['$http', '$resource',
  function($http, $resource) {
    var urlBase = 'api/entries/';
    var myFactory = {};
    myFactory  =  $resource(urlBase + ':entryId', {
      entryId : '@_id'
    },{
      update : {
        method : 'PUT'
      }
    });

    myFactory.getBetweenDates = function(dateObj, callback) {
      return $http.post(urlBase + 'dateRange', dateObj).success(
        function(data, status) {
          callback(data);
        }
      );
    }

    return myFactory;
  }
]);
