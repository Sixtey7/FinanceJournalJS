angular.module('entries').service('MassageService', ['$log',
  function($log) {
    this.massageEntryArray = function(entryArrayToMassage) {
      //var entryArrayToMassage = angular.fromJson(jsonData);
      $log.debug('Got the elements: ' + JSON.stringify(entryArrayToMassage));
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var pastToday = false;
      if (entryArrayToMassage.length > 0) {
        var balance = entryArrayToMassage[0].amount;
        for (var i = 0; i < entryArrayToMassage.length; i++) {
          balance = balance + entryArrayToMassage[i].amount;
          $log.debug('Created the balance ' + balance);
          $log.debug('Got the date: ' + entryArrayToMassage[i].date);
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

    this.placeElementIntoPosition = function(entryArray, entryToPlace, needToRemove) {
      if (entryArray.length > 0) {
        //TODO: We could probably try to combine these two for loops
        var oldLoc = -1;
        if (needToRemove) {
          //try to find the original position
          for (var index = 0; index < entryArray.length; index++) {
            if (entryArray[index].id === entryToPlace.id) {
              oldLoc = index;
              break;
            }
          }
        }

        //find the location to insert the entry
        var insertLoc = 0;
        entryToPlace.date = new Date(entryToPlace.date);
        while (entryToPlace.date.getTime() >= entryArray[insertLoc].date.getTime()) {
          insertLoc++;
          if (insertLoc == entryArray.length) {
            $log.debug('Breaking at: ' + insertLoc);
            break;
          }
        }

        $log.debug('Old Loc: ' + oldLoc);
        $log.debug('Insert Loc: ' + insertLoc);
        if (oldLoc >= 0) {
          if (insertLoc === oldLoc) {
            $log.debug('Old location matched the new one -- nothing to do!');
          }
          else {
            //first, we need to remove it from it's old location
            if (oldLoc < insertLoc) {
              //add the new one in, then remove the old one
              entryArray.splice(insertLoc, 0, entryToPlace);
              entryArray.splice(oldLoc, 1);
            }
            else {
              entryArray.splice(oldLoc, 1);
              entryArray.splice(insertLoc, 0, entryToPlace);
            }
          }
        }
        else {
          //don't need to worry about removing anything
          entryArray.splice(insertLoc, 0, entryToPlace);
        }
    }
    }
  }
]);
