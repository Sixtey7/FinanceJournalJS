//Node Modules
var config = require('./config'),
mongoose = require('mongoose');

//My Modules
require('./colors');

module.exports = function() {
  console.log(('Setting up the database...').debug);
  var db = mongoose.connect(config.dbUri);

  console.log(('Connected to the database...').debug);
  require('../app/models/entry.server.model')


  return db;
}
