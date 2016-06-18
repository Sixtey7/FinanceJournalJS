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
      res.json(entry);
    }
  });
};

/**
* Method used to process entries from a CSV and import them
**/
exports.createFromCSV = function (req, res, next) {
  var csvDataObj = req.body;
  //console.log(JSON.stringify(csvDataObj));
console.log(JSON.stringify(req.body));
  var csvData = req.body;

  console.log(csvData);

  var rows = csvData.split('\n');

  console.log(('Got: ' + rows.length + ' number of rows').debug);

  for (var i = 0; i < rows.length; i++) {
    if (rows[i]) {
      console.log(('Running for row: ' + rows[i]).debug);
      var values = rows[i].split(',');
      console.log(('Row split into: ' + values.length + ' values').debug);
      /**
      * Assumed CSV layout:
      ** 0 - Source
      ** 1 - Amount
      ** 2 - Date
      ** 3 - Estimate
      ** 4 - Planned
      ** 5 - Notes
      **/

      //determine the date
      var date;
      if (values[2]) {
        console.log(('A date was provided, attempting to create an object').debug);
        date = new Date(values[3]);
      }
      else {
        date = Date.now();
      }
      var entry = new Entry({
        source : values[0],
        amount : avalues[1],
        date : date,
        estimate : values[3],
        planned : values[4],
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
      /*if (entries.length > 0) {
        var balance = entries[0].amount;
        for (var i = 0; i < entries.length; i++) {
          balance = balance + entries[i].amount;
          console.log(('Created the balance ' + balance).debug);
          console.log(('Got the date: ' + entries[i].date));
          entries[i].balance = balance;
          entries[i].date = new Date(entries[i].date);
        }
      }

      entries = flagPastElements(entries);
*/
      res.json(entries);
    }
  });
};

exports.read = function(req, res) {
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
      $gte : startDate,
      $lte : endDate
    }
  }).sort({date : 1}).exec(function(err, entries) {
    if (err) {
      return next(err);
    }
    else {
      var balance = 10000;
      for (var i = 0; i < entries.length; i++) {
        balance = balance + entries[i].amount;
        console.log(('Created the balance ' + balance).debug);
        console.log(('Got the date: ' + entries[i].date));
        entries[i].balance = balance;
        entries[i].date = new Date(entries[i].date);
      }
      
      res.json(entries);
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

/*var flagPastElements = function (entryList) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  for (var i = 0; i < entryList.length; i++) {
    console.log((JSON.stringify(entryList[i])).debug);
    //only want to flag an element as done if its not an estimate or not planned
    //also, don't need to bother checking the date if its already done
    if (!entryList[i].planned && !entryList[i].estimate && !entryList[i].done) {
      if (entryList[i].date < today) {
        console.log('Determined ' + entryList[i].date + ' to be before ' + today);
        entryList[i].past = true;
      }
    }
    else {
      entryList[i].past  = false;
    }
  }

  return entryList;
}

var flagElementIfPast = function( element ) {

}
*/
