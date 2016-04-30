//Node Modules
var config = require('./config'),
http = require('http'),
express = require('express'),
morgan = require('morgan'),
compress = require('compression'),
bodyParser = require('body-parser'),
methodOverride = require('method-override');

//My Modules
require('./colors');

module.exports = function(db) {
  console.log(('creating the express app...').debug);
  var app = express();

  var server = http.createServer(app);

  //set up our middleware
  if (process.env.NODE_ENV === 'development') {
    console.log(('Turning on the morgan middleware for development env').info);
    app.use(morgan('dev'));
  }
  else if (process.env.NODE_ENV === 'production'){
    console.log(('Turning on the compress middleware for production').info);
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({
    extended : true
  }));

  app.use(bodyParser.json());
  app.use(methodOverride());

  //Add in our routes
  //TODO: need me some routes...

  //Add in the public directory for the angular stuff
  //TODO: Turn this back on once I have angular stuff to show
  //app.use(express.static('./public'));

  return server;
}
