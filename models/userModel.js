const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please tell us your name']
	},
	email: {
		type: String,
		required: [true, 'Please provide your email'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email']
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		mixlength: 8
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confrim your password'],
		validate: {
			//This Validator work only on SAVE!!!
			validator: function(el) {
				return el === this.password;
			},
			message: 'Password are not the same!'
		}
	}
});

/*Pre-save document middleware*/
userSchema.pre('save', async function(next) {
	//this will run only when the password is actually modified
	if (!this.isModified('password')) return next();

	// Hash the password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	//Delete the passord confirm field
	this.passwordConfirm = undefined;
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
