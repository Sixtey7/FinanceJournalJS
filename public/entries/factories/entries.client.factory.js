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
    entryFactoryInstance.retrieveAll = function(success) {
      $log.debug('retrieveAll called');

      Entries.query(function(entries) {
          for (var i = 0; i < entries.length; i++) {
            massageEntry(entries[i]);
          }
      });

      $log.debug('exit retrieveAll');
    };



    /******************************
    **      Internal Methods     **
    ******************************/
    massageEntry = function(entryToMassage) {
      $log.debug('Massing Entry: ' + JSON.stringify(entryToMassage));
    }

    return entryFactoryInstance;
  }
]);
