// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var Hapi 	= require('hapi');
var express    	= require('express');        // call express
var app        	= express();                 
var bodyParser 	= require('body-parser');
var Post       	= require('./app/models/post');
var Author      = require('./app/models/author');
var mongoose   	= require('mongoose');

SALT_WORK_FACTOR = 10;

//Connection to MongoDB
mongoose.connect('mongodb://localhost/blogsite');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9091;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

	// middleware to use for all requests
	router.use(function(req, res, next) {
	    // do logging
	    console.log('Added to perform validation if any required');
	    next(); // make sure we go to the next routes and don't stop here
	});

	// test route to make sure everything is working (accessed at GET http://localhost:9091/blog)
	router.get('/', function(req, res) {
	    res.json({ message: 'BlogSite Up and Running' });   
	});

	// Register New Author (accessed at POST http://localhost/blog/author)
	router.post('/author',function(req, res) {

		var author 	= new Author();      // create a new instance of the Author model
	        author.a 	= req.body.author;  // set the name (comes from the request)
		author.dob 	= req.body.dateofbirth;
		author.add 	= req.body.address;
	        author.age 	= req.body.age;
	        author.un 	= req.body.username;
	        author.pass 	= req.body.password;
	        author.cd 	= new Date();
	        author.ud 	= new Date();

        	// save the new author and raise errors if any
	        author.save(function(err) {
	        	if (err)
               		res.send(err);
            		res.json({ message: 'New Author Created!' });
        	});
        
    	});

    	// get all the authors (accessed at GET http://localhost/blog/author)
    	router.get('/author',function(req, res) {
        	Author.find(function(err, rows) {
            		if (err)
                	res.send(err);
            		res.json(rows);
        	});
    	});

    	// get all the authors (accessed at GET http://localhost/blog/author/:authorid)
    	router.get('/author/:authorid',function(req, res) {
        	Author.findById(req.params.authorid,function(err, rows) {
            	if (err)
                res.send(err);
            	res.json(rows);
        	});
    	});

    	// Add New Post Record (accessed at POST http://localhost/blog/post)
    	router.post('/post',function(req, res) {
        
        	var post 	= new Post();      // create a new instance of the Begin model
        	post.a 		= req.body.author;  // set the name (comes from the request)
		post.uri 	= req.body.uri;
		post.t 		= req.body.title;
        	post.s 		= req.body.summary;
        	post.b 		= req.body.body;
        	post.ps 	= req.body.pstatus;
        	post.cd 	= new Date();
        	post.ud 	= new Date();

        	// save the new post and raise errors if any
        	post.save(function(err) {
            	if (err)
                res.send(err);
            	res.json({ message: 'New Post Created!' });
        	});
        
    	});

    	// get all the posts (accessed at GET http://localhost/blog/post)
    	router.get('/post',function(req, res) {
        	Post.find(function(err, rows) {
            		if (err)
                	res.send(err);
            		res.json(rows);
        	});
    	});

    	// get all the posts (accessed at GET http://localhost/blog/post/:postid)
    	router.get('/post/:postid',function(req, res) {
        	Post.findById(req.params.postid,function(err, rows) {
            	if (err)
                res.send(err);
            	res.json(rows);
        	});
    	});

    	// delete the post (accessed at DELETE http://localhost/blog/post/:postid)
    	router.delete('/post/:postid',function(req, res) {
        	Post.findById(req.params.postid,function(err, post) {
            		if (err)
                	res.send(err);
			post.remove(function(err) {
	    			if (err) throw err;
	          		res.json({message: 'Post Deleted Succesfully!!!'});
			});
    		});
	});

    	// update the post (accessed at PUT http://localhost/blog/post/:postid)
    	router.put('/post/:postid',function(req, res) {
        	Post.findById(req.params.postid,function(err, post) {
            		if (err)
                	res.send(err);
		
			post.b 		= req.body.body;
			post.ps		= req.body.status;
			post.s		= req.body.summary;
			post.t		= req.body.title;
			post.uri	= req.body.uri;
			post.ud		= new Date();
		
            		post.save(function(err) {
                		if (err)
                    		res.send(err);
                		res.json({ message: 'Post updated!' });
			});
        	});
    	});

	//Add a comment to the post. (accessed at POST http://localhost/blog/comment/:postid)
    	router.post('/comment/:postid',function(req,res){
		Post.findById(req.params.postid,function(err,post){
			post.c.push({ca:req.body.author,ccd:new Date(),cb:req.body.body});
			post.save(function(err) {
                		if (err)
                    		res.send(err);
                		res.json({ message: 'Comment Added!' });
			});
		});
	});	

        //Update comment to the post. (accessed at PUT http://localhost/blog/post/:postid/:commentid)
        router.put('/post/:postid/:commentid',function(req,res){
		Post.update({'c._id': req.params.commentid},
      		{
		'$set': {
             		'c.$.cb'	: req.body.body,
			'c.$.cud'	: new Date()
	   		}
		},
          	function(err,post) {
	   		if(err){
        			console.log(err);
        			return res.send(err);
        			}
        		return res.json({message : 'Comment Successfully Updated!!!'});
 		});
        });

        //Remove comment to the post. (accessed at DELETE http://localhost/blog/post/:postid/:commentid)
        router.delete('/post/:postid/:commentid',function(req,res){
		Post.findByIdAndUpdate(req.params.postid,{ 
			$pull: { 'c': {  _id: req.params.commentid} } 
		},function(err,model){
      			if(err){
       			console.log(err);
       			return res.send(err);
        		}
        	return res.json({message : 'Comment Deleted Succesfully!!!'});
    		});
        });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /blog
app.use('/blog', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
