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
      ** 1 - Debit
      ** 2 - Credit
      ** 3 - Date
      ** 4 - Estimate
      ** 5 - Notes
      **/
      //first we need to determine the amount (positive or negative)
      var amount = 0;
      if (values[1]) {
        console.log(('Debit was provided, making amount a negative of that number'));
        amount = (-1) * values[1];
      }
      else if (values[2]){
          console.log(('Credit was provided (and debit was not), setting value'));
          amount = values[2];
      }
      else {
        console.log(('Neither credit nor debit was provided!').warn);
      }

      //determine the date
      var date;
      if (values[3]) {
        console.log(('A date was provided, attempting to create an object').debug);
        date = new Date(values[3]);
      }
      else {
        date = Date.now();
      }
      var entry = new Entry({
        source : values[0],
        amount : amount,
        date : date,
        estimate : values[4],
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
  /*Entry.find({}, function(err, entries) {
    if (err) {
      return next(err);
    }
    else {
      res.json(entries);
    }
  });*/
  Entry.find({}).sort({date : 1}).exec(function(err, entries) {
    if (err) {
      return next(err);
    }
    else {
      var balance = 10000;
      for (var i = 0; i < entries.length; i++) {
        balance = balance - entries[i].amount;
        console.log(('Created the balance ' + balance).debug);
        entries[i].balance = balance;
      }
      res.json(entries);
    }
  });
};

exports.read = function(req, res) {
  res.json(req.entry);
};

/**
* UPDATE
**/
exports.update = function (req, res, next) {
  Entry.findByIdAndUpdate(req.entry.id, req.body, function(err, entry) {
    if (err) {
      return next(err);
    }
    else {
      res.json(entry);
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
