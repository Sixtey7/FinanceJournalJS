angular.module('entries').controller('EntriesController', ['$scope', '$routeParams', '$location', '$mdDialog', '$mdToast', '$mdMedia', 'Entries',
  function($scope, $routeParams, $location, $mdDialog, $mdToast, $mdMedia, Entries) {

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
      $mdDialog.hide()

      var entry = new Entries({
        source : this.source,
        amount : this.amount,
        date : this.date,
        estimate : this.estimate,
        planned : this.planned,
        notes : this.notes
      });

      entry.$save(function(response) {
        console.log('Successfully created!');
        $scope.entries.push(response);

        showToast('Entry Successfully Created!');

      }, function(errorResponse) {
        console.log('Failed on creation!');
        $scope.error = errorResponse.data.message;
      });
    };

    /**
    * READ
    **/
    function success(newEntries) {
      console.log('Success Called!');

      console.log('Got the entries: ' + JSON.stringify(newEntries));
      /** TODO: Super temp code **/
      for (var i = 0; i < newEntries.length; i++) {
        newEntries[i].date = new Date(newEntries[i].date);
      }
      /** TODO: End Super temp code **/

      //Probably less temp code, but temp code nevertheless
      if ($scope.entries) {
        console.log('clearing the existing array');

        $scope.entries.splice(0, $scope.entries.length);

        $scope.entries.push.apply($scope.entries, newEntries);

      }
      else {
        console.log('creating the entries element');
        $scope.filterDate = {};
        $scope.entries = newEntries;
      }

      if ($scope.startDate) {
        $scope.filterDate.startTime = $scope.startDate.toDateString();
      }

      if ($scope.endDate) {
        $scope.filterDate.endTime = $scope.endDate.toDateString();
      }

      console.log('scope.entries: ' + JSON.stringify($scope.entries));
    };

    $scope.find = function() {
      //$scope.entries = Entries.query();
      $scope.promise = Entries.query($scope.query, success).$promise;
    };

    $scope.findOne = function() {
      $scope.entry = Entries.get({
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
        targetEvent : ev,
        clickOutsideToClose : true,
        fullscreen : useFullScreen,
        scope : $scope,        // use parent scope in template
        preserveScope: true  // do not forget this if use parent scope
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
    * Prompt the user to confirm that they want to delete the selected element
    * If so, delete it!
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
        entryToDelete.$delete(entryToDelete.id,
          function() {
            console.log('Successfully Deleted!');

            var index = $scope.entries.indexOf(entryToDelete);
            console.log('Got the index: ' + index);
            $scope.entries.splice(index, 1);

            showToast('Entry Successfully Deleted!');
          },function() {
            console.log('Failed To Delete');

            showToast('Error Deleting Entry!');
          });
      }, function() {
        console.log('Selected To Keep It Around');
        showToast('No Action Taken');
      });
    };

    /**
    * Make the current row editable
    * Or save changes if it is already editable
    **/
    $scope.editElement = function(entryToEdit) {
      if (entryToEdit.editable) {
        console.log('Entry was editable - saving it!');
        entryToEdit.$save(
          function() {
            console.log('Successfully Saved!');
            showToast('Update Saved!');
          },
          function() {
            console.log('Failed To Save...');
            showToast('Error Saving Update!');
          }
        )
        entryToEdit.editable = false;
      }
      else {
        console.log('Entry was not editable - changing to editable');
        entryToEdit.editable = true;
      }
    };

    /**
    * Revert All Changes
    **/
    /*$scope.revertAllChanges = function() {
      var confirmRevertDialog = $mdDialog.confirm()
        .title('Confirm Revert')
        .textContent('Are you sure you want to revert all changes?')
        .ariaLabel('Confirm Revert')
        .ok('Revert All!')
        .cancel('Please Don\'t Revert');

      $mdDialog.show(confirmRevertDialog).then(
        function() {
          console.log('Selected To Revert')
          $location.path('entries/');

        }, function() {
          console.log('Selected To Not Revert');
        }
      );
    };
*/
    $scope.revertChange = function( entryToRevert ) {
      var index = $scope.entries.indexOf(entryToRevert);
      console.log('Got the index: ' + index);
      $scope.entries[index] = Entries.get({
        entryId : entryToRevert.id
      });
    }

    $scope.showDateDialog = function(ev) {
      console.log('about to show date dialog');

      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

      $mdDialog.show({
        controller : DialogController,
        templateUrl : '../entries/views/date-filter.client.view.html',
        parent : angular.element(document.body),
        targetEvent : ev,
        clickOutsideToClose : true,
        fullscreen : useFullScreen,
        scope : $scope,        // use parent scope in template
        preserveScope: true  // do not forget this if use parent scope
      })
      .then(function(answer) {
        $scope.status = 'Date Filter Applied!';
      }, function() {
        $scope.status = 'Date Filter Canceled';
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }

    $scope.findBetweenDates = function(event) {
      $mdDialog.hide();

      console.log('Start Date: ' + $scope.startDate +  ' End Date : ' + $scope.endDate);

      $scope.startDateString = $scope.startDate.toDateString() + '';

      console.log('Current entries' + JSON.stringify($scope.entries));
      //$scope.entries.pop();

      var dateObj = {};
      dateObj.startDate = this.startDate;
      dateObj.endDate = this.endDate;
      $scope.promise = Entries.getBetweenDates(dateObj, success).$promise;
    }

    $scope.removeFilter = function(ev) {
      $scope.filterDate = {};
      $scope.promise = Entries.query($scope.query, success).$promise;
    }

    function showToast (messageToShow) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(messageToShow)
          .position('bottom left right')
          .hideDelay(3000)
      );

    }
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
