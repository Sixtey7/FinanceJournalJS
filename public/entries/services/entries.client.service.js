angular.module('entries').factory('Entries', ['$http', '$resource', '$log', 'MassageService',
  function($http, $resource, $log, MassageService) {
    var urlBase = 'api/entries/';
    var myFactory = {};



    var parseDataForMassage = function(jsonData) {
      var entryArrayToMassage = angular.fromJson(jsonData);
      return MassageService.massageEntryArray(entryArrayToMassage);
    }

    myFactory  =  $resource(urlBase + ':entryId', {
      entryId : '@_id'
    },{
      get:     { method: 'GET' },
      query : { method: 'GET',  transformResponse: parseDataForMassage, isArray: true },
      update : { method : 'PUT' }
    });


    myFactory.getBetweenDates = function(dateObj, callback) {
      return $http.post(urlBase + 'dateRange', dateObj).success(
        function(data, status) {
          callback(MassageService.massageEntryArray(data));
        }
      );
    }

    return myFactory;
  }
]);
