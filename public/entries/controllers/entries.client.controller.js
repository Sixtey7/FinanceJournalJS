angular.module('entries').controller('EntriesController', ['$scope', '$routeParams', '$location', '$mdDialog', '$mdMedia', 'Entries',
  function($scope, $routeParams, $location, $mdDialog, $mdMedia, Entries) {

    //TODO: Long Term I probably shouldn't have this in two places
    var MONTH_NAMES = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    /**
    * CREATE
    **/
    $scope.create = function() {
      var entry = new Entries({
        source : this.source,
        amount : this.amount,
        date : this.date,
        estimate : this.estimate,
        planned : this.planned,
        notes : this.notes
      });

      entry.$save(function(response) {
        /** TODO: There's probably a better way to do the refresh here, like tell angular
        to requery its dataset, but fuck if I know how **/
        $location.path('entries/')
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    /**
    * READ
    **/
    function success(entries) {
      $scope.entries = entries;
    };

    $scope.find = function() {
      //$scope.entries = Entries.query();
      $scope.promise = Entries.query($scope.query, success).$promise;
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

    /**
    * Show the filter html
    **/
    $scope.showNewEntryDialog = function(ev) {
      console.log('Show new entry dialog');
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

      $mdDialog.show({
        controller : DialogController,
        templateUrl : '../entries/views/add-entry.client.view.html',
        parent : angular.element(document.body),
        targentEvent : ev,
        clickOutsideToClose : true,
        fullscreen : useFullScreen
      })
      .then(function(answer) {
        $scope.status = 'New Entry Added!';
      }, function() {
        $scope.status = 'Entry Added Canceled';
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }

    /**
    * Delete the selected element
    **/
    $scope.deleteElement = function(entryToDelete) {
      console.log('User selected to delete: ' + JSON.stringify(entryToDelete));

      //build the text content
      var textToShow = 'Are you sure you want to delete ' + entryToDelete.name + ' from ';
      var dateObj = new Date(entryToDelete.date);
      textToShow += MONTH_NAMES[dateObj.getMonth()] + ' ' + dateObj.getDate() + '?';

      var confirmDeleteDialog = $mdDialog.confirm()
        .title('Confirm Deletion')
        .textContent(textToShow)
        .ariaLabel('Confirm Deletion')
        .ok('Delete!')
        .cancel('Please Don\'t Delete');

      $mdDialog.show(confirmDeleteDialog).then(function() {
        console.log('Selected To Delete')
        entryToDelete.$delete(entryToDelete,function() {
          console.log('Successfully Deleted!');
          $location.path('entries/')
        },function() {
          console.log('Failed To Delete');
        });
      }, function() {
        console.log('Selected To Keep It Around');
      });
    };
  }
]);
function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}
