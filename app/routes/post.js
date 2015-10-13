// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    		= require('express');        // call express
var app        		= express();                 
var Post       		= require('../models/post');
var router		= express.Router();

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

module.exports = router;
