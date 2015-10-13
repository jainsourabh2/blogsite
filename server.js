// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
//var Hapi 		= require('hapi');
var express    		= require('express');        // call express
var app        		= express();                 
var bodyParser 		= require('body-parser');
var Post       		= require('./app/models/post');
var Author      	= require('./app/models/author');
var mongoose   		= require('mongoose');
var config 		= require('./config'); // get our config file
var morgan		= require('morgan');
var jwt    		= require('jsonwebtoken'); // used to create, sign, and verify tokens
var async		= require('async');
var fs 			= require('fs');
var FileStreamRotator 	= require('file-stream-rotator')
//var authorroutes= require('./app/routes/author')(app);

var logDirectory = '/opt/blog/logs';

// ensure log directory exists 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream 
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: "YYYY-MM-DD"
})

//Connection to MongoDB
mongoose.connect(config.database);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setup the logger 
app.use(morgan('combined', {stream: accessLogStream}));

var port = process.env.PORT || config.port;        // set our port

// ROUTES FOR OUR API
// =============================================================================
//var router = express.Router();              // get an instance of the express Router

var author	 = require('./app/routes/author');
var post	 = require('./app/routes/post');

app.use('/blog',author);
app.use('/blog',post);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /blog
//app.use('/blog', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('App listening on port ' + port);
