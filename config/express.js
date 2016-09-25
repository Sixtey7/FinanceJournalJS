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

  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  //Add in our routes
  require('../app/routes/index.server.routes.js')(app);
  require('../app/routes/entry.server.routes.js')(app);
  require('../app/routes/account.server.routes.js')(app);

  //Add in the public directory for the angular stuff
  app.use(express.static('./public'));

  return server;
}
