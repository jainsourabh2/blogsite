var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CommentSchema = new Schema({
	ca : {type: String,trim: true}, // Comment of the Author
	ccd : {type : Date}, //Created Date of the Comment
	cb : {type : String} //Comment Body
});

var PostSchema   = new Schema({
	a : {type: String,trim: true}, //author
	uri : {type: String,trim: true}, //URI of the Author
	t : {type: String,trim: true}, //title of the Post
	s : {type: String,trim: true}, //Summary of the Post
	b : {type: String,lowercase: true,trim: true}, // Body of the Post
	ps : {type: String,lowercase: true,trim: true,enum: ['i', 'a', 'd']}, // Post Status
	cd : {type : Date}, //Create Date of the Post
	ud : {type : Date}, //Last Updated Date of the Post
	c : [CommentSchema] //Comments Array
});

module.exports = mongoose.model('Comment',CommentSchema);
module.exports = mongoose.model('Post', PostSchema);
