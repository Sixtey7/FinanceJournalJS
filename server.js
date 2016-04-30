process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose =  require('./config/mongoose');
var express = require('./config/express');
require('./config/colors');

console.log(('About to set up the database...').debug);
var db = mongoose();

console.log(('About to set up the server...').debug);
var app = express(db);

console.log(('About to listen on port 3000...').debug);
app.listen(3000);

module.exports = app;

console.log(('Server running at http://localhost:3000/').info);
