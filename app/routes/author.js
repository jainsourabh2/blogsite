// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    		= require('express');        // call express
var app        		= express();                 
var bodyParser 		= require('body-parser');
var Author      	= require('../models/author');
var jwt    		= require('jsonwebtoken'); // used to create, sign, and verify tokens
var async		= require('async');
var config              = require('../../config'); // get our config file

// ROUTES FOR OUR API
// =============================================================================
	var router = express.Router();              // get an instance of the express Router
	
	// Register New Author (accessed at POST http://localhost/blog/author)
	router.post('/author',function(req, res) {
		//console.log("Inside author post");
		var author 	= new Author();      // create a new instance of the Author model
	        author.a 	= req.body.author;  // set the name (comes from the request)
		author.dob 	= new Date(req.body.dob);
		author.add 	= req.body.address;
	        author.age 	= req.body.age;
	        author.un 	= req.body.username;
	        author.pass 	= req.body.password;
	        author.cd 	= new Date();
	        author.ud 	= new Date();
		//console.log("Inside Post");

		async.series([
			function(callback){
        			// save the new author and raise errors if any
	        		author.save(function(err) {
	        			if (err)
               				callback(err);
					callback();
					});
				},
			function(callback){
        			var token = jwt.sign(author, config.secret, {
          				expiresIn: config.expireInSeconds
        				});
        			// return the information including token as JSON
		
        			res.json({
          				success: true,
					message: 'New Author Created.',
          				token: token
        			});
				callback();
				}
			],
			function(err) {
			        if (err)
					{
					console.log(err);
					return(err);
					}
				}
		);

    	});

        //Authenticate the User.(accessed at POST http://localhost/blog/authenticateauthor)
        router.post('/authenticateauthor',function(req,res){
 		// find the author
		//console.log("Inside authenticateauthor post");
  		Author.findOne({
			un: req.body.username
		}, function(err, user) {
			if (err) throw err;
    			if (!user) {
      				res.json({ success: false, message: 'Authentication failed. Author not found.' });
    			} else if (user) {
				user.comparePassword(req.body.password, function(err, isMatch) {
				        if (err) throw err;
        				//console.log(req.body.password, isMatch); // Display Password for development only. Needs to be deleted for future.:wq
      					// check if password matches
      					if (!isMatch) {
        					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      					} else {
        					// if user is found and password is right
        					// create a token
						user.ts = new Date();
        					var token = jwt.sign(user, config.secret, {
          					expiresIn: config.expireInSeconds // expires in 60 mins
        					});
        					// return the information including token as JSON
        					res.json({
          						success: true,
          						token: token
        					});
      					}
				});   

    			}

  		});
       });

	// middleware to use for all requests
	router.use(function(req, res, next) {
	    	// do logging
		
	    	//console.log('Inside Middleware');
		
		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		//console.log('Inside Middleware-1');
	
		//decode token
		if(token){
			// console.log('Inside Middleware-2');
			// verifies secret and checks exp
    			jwt.verify(token, config.secret, function(err, decoded) {
				if(err) {
					//console.log('Inside Middleware-3');
					return res.json({
						success : false,
						message : 'Failed to authenticate token'
					});
				}
				else	{
					//console.log('Inside Middleware-4');
					req.decoded = decoded;
					next();
				}
			});      

		}
		else {
			return res.status(403).send({
				success : false,
				message : 'No Token provided'
			});
		}		
	
	});

	// test route to make sure everything is working (accessed at GET http://localhost:9091/blog)
	router.get('/', function(req, res) {
	    res.json({ message: 'BlogSite Up and Running' });   
	});


    	// get all the authors (accessed at GET http://localhost/blog/author)
    	router.get('/author',function(req, res) {
		//console.log("Inside author get all");
        	Author.find(function(err, rows) {
            		if (err)
                	res.send(err);
            		res.json(rows);
        	});
    	});

    	// get all the authors (accessed at GET http://localhost/blog/author/:authorid)
    	router.get('/author/:authorid',function(req, res) {
		//console.log("Inside author get single");
        	Author.findById(req.params.authorid,function(err, rows) {
            	if (err)
                res.send(err);
            	res.json(rows);
        	});
    	});
module.exports = router;
