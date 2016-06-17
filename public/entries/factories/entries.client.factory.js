angular.module('entries').factory('EntriesFactory', ['$log', 'Entries',

  function($log, Entries) {
    var entryFactoryInstance = {};

    entryFactoryInstance.entries = [];

    /******************************
    **        CRUD Methods       **
    ******************************/

    /**
    * CREATE
    **/
    entryFactoryInstance.save = function(entryToSave) {
      $log.debug('Save Called');



      $log.debug('Exit Save');
    };

    /**
    * READ
    **/
    entryFactoryInstance.retrieveAll = function() {
      $log.debug('retrieveAll called');

      return (Entries.query()).then
      (
        function(entries) {
            massageEntryArray(entries);

            entryFactoryInstance.entries = entries;

            return entryFactoryInstance.entries;
        }
      );

      $log.debug('exit retrieveAll');
    };



    /******************************
    **      Internal Methods     **
    ******************************/
    massageEntryArray = function (entryArrayToMassage) {
      for (var i = 0; i < entryArrayToMassage.length; i++) {
        massageEntry(entryArrayToMassage[i]);
      }
    };

    massageEntry = function(entryToMassage) {
      entryToMassage.date = new Date(entryToMassage.date);
      $log.debug('Massing Entry: ' + JSON.stringify(entryToMassage));
    };

    return entryFactoryInstance;
  }
]);
