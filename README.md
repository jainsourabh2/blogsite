# blogsite
Node apis to connect to MongoDB Using Mongoose for a blog website

POST	  Author Registration		http:localhost:9091/blog/author                                                         
POST	  Author Login			
POST	  Create Post					  http:localhost:9091/blog/post                                                         
PUT		  Edit Post					    http:localhost:9091/blog/post/:postid                                                      
DELETE	Delete Post					  http:localhost:9091/blog/post/:postid                                                    
GET		  Get A Post					  http:localhost:9091/blog/post/:postid                                                     
GET		  Get All Posts				  http:localhost:9091/blog/post/                                                         
POST	  Create Comments				http:localhost:9091/blog/comment/:postid                                                  
PUT		  Edit Comments				  http:localhost:9091/blog/post/:postid/:commentid                                          
DELETE	Delete Comment			  http:localhost:9091/blog/post/:postid/:commentid                                          
GET		  Get All Authors				http:localhost:9091/blog/author                                                         
GET		  Get 1 Author				  http:localhost:9091/blog/author/:authorid                                                  
