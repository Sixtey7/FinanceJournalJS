var Entry = require('mongoose').model('Entry');
require('../../config/colors');

/**
* Utility method used to retrieve an error
**/
var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
        console.log(('Entry has already been registered exception').error);
        message = 'Entry has already been registered';
        break;
      default:
        console.log(('Unknown entry error!').error);
        message = 'Uknown error with entry';
        break;
    }
  }
  else {
    for (var errorName in err.errors) {
      if (err.error[errName].message) {
        message = err.errors[errName].message;
        console.log(('Got error with entry: ' + message).error);
      }
    }
  }

  return message;
}

/**********************
*** CRUD OPERATIONS ***
***********************/

/**
* CREATE
**/
exports.create = function (req, res, next) {
  var entry = new Entry(req.body);

  console.log(('Create got the entry: ' + JSON.stringify(req.body)).debug);

  console.log(('Created the entry: '  + JSON.stringify(entry)).debug);
  entry.save(function(err) {
    if (err) {
      return next(err);
    }
    else {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(entry);
    }
  });
};

/**
* Method used to process entries from a CSV and import them
**/
exports.createFromCSV = function (req, res, next) {
  var csvDataObj = req.body;

  var csvData = JSON.stringify(csvDataObj);
  //return false;

  console.log(csvData);

  var rows = csvData.split('\\r\\n');

  console.log(('Got: ' + rows.length + ' number of rows').debug);

  for (var i = 0; i < rows.length; i++) {
    if (rows[i]) {
      console.log(('Running for row: ' + rows[i]).debug);
      var values = rows[i].split(',');
      console.log(('Row split into: ' + values.length + ' values').debug);
      /**
      * Assumed CSV layout:
      ** 0 - Source
      ** 1 - Debit
      ** 2 - Credit
      ** 3 - Total
      ** 4 - Date
      ** 5 - Notes
      **/

      //determine the date
      var date;
      if (values[4]) {
        console.log(('A date was provided, attempting to create an object').debug);
        date = new Date(values[4]);

        if (date === undefined) {
          console.log(('Failed to create the date object out of the value: ' + values[4] + ' using today').warn);
          date = Date.now();
        }
      }
      else {
        console.log(('No date detected').warn);
        date = Date.now();
      }
      
      var amount = values[2];
      //determine the amount
      if (values[1]) {
        console.log(('Determine the amount to be negative: ' + values[1]).warn);
        amount = -1 * values[1];
      }

      //shitty attempt to determine if the entry is an estimate
      var estimate = false;
      if (values[5]) {
        console.log(('Looking for an estimate in the notes string: ' + values[5]).debug);
        if (values[5].indexOf('est') !== -1) {
          console.log(('Determine that this is an estimate').debug);
          estimate = true;

          //TODO: should probably parse out the est at this point, but, meh
        }
      }

      //equally shitty attempt to determine if the entry is planned
      var planned = false;
      if (values[5]) {
        console.log(('Looking for an planned in the notes string: ' + values[5]).debug);
        if (values[5].indexOf('planned') !== -1) {
          planned = true;
          //TODO: should probably parse out the planned at this point, but, meh
        }
      }

      var entry = new Entry({
        source : values[0],
        amount : amount,
        date : date,
        estimate : estimate,
        planned : planned,
        notes : values[5]
      });

      entry.save();

      console.log(('Created the entry:\n' + JSON.stringify(entry)).debug);
    }
    else {
      console.log(('skipping row: ' + i + ' as it had no data!').debug);
    }
  }
  res.json('Success');
}

/**
* READ
**/
exports.list = function(req, res, next) {
  Entry.find({}).sort({date : 1}).exec(function(err, entries) {
    if (err) {
      return next(err);
    }
    else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(entries);
    }
  });
};

exports.read = function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(req.entry);
};

/**
* Find entries in between dates
**/
exports.findBetweenDates = function(req, res, next) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  console.log((JSON.stringify(req.body)).debug);

  console.log(('Finding between date range: ' + startDate + ' and ' + endDate).debug);

  Entry.find({
    date : {
      //$gte : startDate,
      $lte : endDate
    }
  }).sort({date : 1}).exec(function(err, entries) {
    if (err) {
      return next(err);
    }
    else {
      //array to hold the entries we want to send to the client
      var entriesToSend = new Array();

      //starting balance to calculate;
      var startingBalance = 0;

      var startDateObject = new Date(startDate);

      //boolean to hold whether or not we have passed the start sdate
      var passedDate = false;
      for (var i = 0; i < entries.length; i++) {
        console.log(('Got the date: ' + entries[i].date));
        entries[i].date = new Date(entries[i].date);

        if (passedDate) {
          //we're past the date, so we can safely just add to the array
          entriesToSend.push(entries[i])
        }
        else {
          if (entries[i].date.getTime() >= startDateObject.getTime()) {
            //we are within the elements that the user cares about
            passedDate = true;

            //since this is in the set - Add it!
            entriesToSend.push(entries[i]);
          }
          else {
            startingBalance += entries[i].amount;
          }
        }
        
      }

      res.setHeader('Access-Control-Allow-Origin', '*');

      //build the object to send
      //TODO: There's probably a better way to do this than just creating a random object
      var objectToSend = {};
      objectToSend.entryArray = entriesToSend;
      objectToSend.startingBalance = startingBalance;
      res.json(objectToSend);
    }
  });
};

/**
* UPDATE
**/
exports.update = function (req, res, next) {
  /*console.log((JSON.stringify(req.entry)).error);
  delete req.entry._id;
  console.log((JSON.stringify(req.entry)).error); */
  Entry.findByIdAndUpdate(req.entry.id, req.body, function(err, entry) {
    if (err) {
      return next(err);
    }
    else {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(entry);
    }
  });
};

exports.performElementMaintenance = function (req, res, next) {
  //probably want to pair this done (ie just select not done, planned, estimate, anything in the past, etc)
  Entry.find({}).sort({date : 1}).exec(function(err, entries) {
    if (err) {
      return next(err);
    }
    else {
      entries = flagPastElements(entries);
      //TODO: Need to figure out how to save this
      res.json('Success');
    }
  });
};

/**
* DELETE
**/
exports.delete = function (req, res, next) {
  req.entry.remove(function(err) {
    if (err) {
      return next(err);
    }
    else {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(req.entry);
    }
  });
};

/*****************
*** MIDDLEWARE ***
******************/
exports.entryById = function (req, res, next, id) {
  Entry.findOne({
    _id : id
  }, function (err, entry) {
    if (err) {
      return next(err);
    }
    else {
      req.entry = entry;
      next();
    }
  });
};
