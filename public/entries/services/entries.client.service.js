angular.module('entries').factory('Entries', ['$http', '$resource', '$log',
  function($http, $resource, $log) {
    var urlBase = 'api/entries/';
    var myFactory = {};


    var massageEntryArray = function(jsonData) {
      var entryArrayToMassage = angular.fromJson(jsonData);
      $log.debug('Got the elements: ' + JSON.stringify(entryArrayToMassage));
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var pastToday = false;
      if (entryArrayToMassage.length > 0) {
        var balance = entryArrayToMassage[0].amount;
        for (var i = 0; i < entryArrayToMassage.length; i++) {
          balance = balance + entryArrayToMassage[i].amount;
          console.log(('Created the balance ' + balance).debug);
          console.log(('Got the date: ' + entryArrayToMassage[i].date));
          entryArrayToMassage[i].balance = balance;
          entryArrayToMassage[i].date = new Date(entryArrayToMassage[i].date);

          //check if the element should be flagged as done
          if (!pastToday) {
            if (!entryArrayToMassage[i].planned && !entryArrayToMassage[i].estimate && !entryArrayToMassage[i].done) {
              if (entryArrayToMassage[i].date < today) {
                entryArrayToMassage[i].past = true;
              }
              else {
                pastToday = true;
              }
            }
            else {
              entryArrayToMassage[i].past = false;
            }
          }
        }
      }

      return entryArrayToMassage;
    }


    myFactory  =  $resource(urlBase + ':entryId', {
      entryId : '@_id'
    },{
      get:     { method: 'GET' },
      query : { method: 'GET',  transformResponse: massageEntryArray, isArray: true },
      update : { method : 'PUT' }
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
