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
* READ
**/
exports.list = function(req, res, next) {
  Entry.find({}, function(err, entries) {
    if (err) {
      return next(err);
    }
    else {
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
