angular.module('entries').controller('EntriesController', ['$scope', '$routeParams', '$location', '$mdDialog', '$mdToast', '$mdMedia', 'Entries', 'EntriesFactory',
  function($scope, $routeParams, $location, $mdDialog, $mdToast, $mdMedia, Entries, EntriesFactory) {

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

        //change the date to a date object
        response.date = new Date(response.date);

        if ($scope.entries.length > 0) {
          var insertLoc = 0;
          while (response.date.getTime() >= $scope.entries[insertLoc].date.getTime()) {
            insertLoc++;
            if (insertLoc == $scope.entries.length) {
              console.log('Breaking at: ' + insertLoc);
              break;
            }
          }
          $scope.entries.splice(insertLoc, 0, response);

          massageEntries();

        }

        showToast('Entry Successfully Created!');

      }, function(errorResponse) {
        console.log('Failed on creation!');
        $scope.error = errorResponse.data.message;
      });
    };

    /**
    * READ
    **/
    /** TODO - Eventually, we should remove this and move to events **/
    function success(newEntries) {
      console.log('Success Called!');
      if ($scope.entries) {
        scope.entries.splice(0, $scope.entries.length);

        $scope.entries.push.apply($scope.entries, newEntries);

      }
      else {
        console.log('creating the entries element');
        $scope.filterDate = {};
        $scope.entries = newEntries;
      }
    };

    $scope.find = function() {
      $scope.promise = Entries.query($scope.query, success).$promise;

      //EntriesFactory.retrieveAll($scope, success);
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
            massageEntries();
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
            massageEntries();
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
          .position('bottom left')
          .hideDelay(1500)
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
