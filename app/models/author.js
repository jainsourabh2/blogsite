var mongoose	= require('mongoose');
var bcrypt		= require('bcrypt');
var Schema		= mongoose.Schema;

SALT_WORK_FACTOR = 10;

var AuthorSchema = new Schema({
        a : {type: String,trim: true, required: true}, // Name of the Author
        dob : {type : Date}, //Authors Date of Birth
        add : {type : String}, //Address of the Author
        age : {type : Number , min:5 , max:20}, //Age of the Author. It can be minium 5 and maximum 20.
        un : {type : String,required: true, index: { unique: true }}, // username of the Author.
        pass : {type : String,required: true}, //Password of the Author
	cd : {type : Date}, //Create Date of the Post
	ud : {type : Date}, //Last Updated Date of the Post	
	ts : {type : Date} //Temporary Timestamp for creation of token	
});

AuthorSchema.pre('save', function(next) { 

var user = this;
// only hash the password if it has been modified (or is new)
if (!user.isModified('pass')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    
// hash the password along with our new salt
    bcrypt.hash(user.pass, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.pass = hash;
        next();
    
	});
 	});
});

AuthorSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.pass, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Author', AuthorSchema);
