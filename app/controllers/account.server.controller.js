var Account = require('mongoose').model('Account');
require('../../config/colors');

/**
 * Utility method used to retrieve an error
 */
var getErrorMessage = function(err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
                console.log(('Account has already been registered exception').error);
                message = 'Account has already been registered';
                break;
            default:
                console.log(('Unknown Account Exception').error);
                message = 'Unknwon error with account';
                break;
        }
    }
    else {
        for (var errorName in err.errors) {
            if (err.error[errName].message) {
                message += err.errors[errName].message;
                console.log(('Got error with account: ' + message).error);
            }
        }
    }

    return message;
}

/**********************
 *** CRUD OPERATORS ***
 *********************/

/**
 * CREATE
 */
exports.create = function(req, res, next) {
    console.log(('Got the json: ' + req.body));
    var account = new Account(req.body);

    console.log(('Create got the account: ' + JSON.stringify(req.body)).debug);
    console.log(('Created the account: ' + JSON.stringify(account)).debug);

    account.save(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(account)
        }
    });
};

//TODO: If we do import from csv of accounts, here's the place

/**
 * READ
 */
exports.list = function(req, res, next) {
    Account.find({}).sort({dateCreated : 1}).exec(function(err, accounts) {
        if (err) {
            return next(err);
        }
        else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(accounts);
        }
    });
};

exports.read = function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(req.account);
};

//TODO: If we do an export to csv, here's the place

/**
 * UPDATE
 */
exports.update = function(req, res, next) {
    Account.findByIdAndUpdate(req.entry.id, req.body, function(err, account) {
        if (err) {
            return next(err);
        }
        else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(account);
        }
    });
};

/**
 * DELETE
 */
exports.delete = function(req, res, next) {
    req.account.remove(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(req.account);
        }
    });
};

/******************
 *** MIDDLEWARE ***
 *****************/
exports.accountById = function(req, res, next, id) {
    Account.findOne({
        _id : id
    }, function(err, account) {
        if (err) {
            return next(err);
        }
        else {
            req.account = account;
            next();
        }
    });
};