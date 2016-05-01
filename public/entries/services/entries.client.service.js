angular.module('entries').factory('Entries', ['$resource',
  function($resource) {
    return $resource('api/entries/:entryId', {
      entryId : '@_id'
    },{
      update : {
        method : 'PUT'
      }
    });
  }
]);
