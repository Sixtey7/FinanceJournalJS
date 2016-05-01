angular.module('entries').controller('EntriesController', ['$scope', '$routeParams', '$location', 'Entries',
  function($scope, $routeParams, $location, Entries) {

    /**
    * CREATE
    **/
    $scope.create = function() {
      var entry = new Entries({
        source : this.source,
        amount : this.amount,
        date : this.date,
        estimate : this.estimate,
        notes : this.notes
      });

      entry.$save(function(response) {
        $location.path('entries/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    /**
    * READ
    **/
    $scope.find = function() {
      $scope.entries = Entries.query();
    };

    $scope.findOne = function() {
      $scope.article = Entries.get({
        entryId : $routeParams.entryId
      });
    };


    /**
    * UPDATE
    **/

    $scope.update = function() {
      $scope.entry.$update(function() {
        $location.path('entries/' + $scope.entry._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    /**
    * DELETE
    **/
    $scope.delete = function(entry) {
      if (entry) {
        entry.remove(function() {
          for (var i in $scope.entries) {
            if ($scope.entries[i] === entry) {
              $scope.entries.splice(i, 1);
            }
          }
        });
      }
      else {
        $scope.entry.$remove(function() {
          $location.path('entries');
        });
      }
    };
  }
]);
