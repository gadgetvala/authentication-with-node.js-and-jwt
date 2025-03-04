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
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user'
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		mixlength: 8,
		select: false
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
	},
	changedPasswordAt: Date
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

/*Instances Method*/
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
	if (this.changedPasswordAt) {
		const changedTimeStamp = parseInt(this.changedPasswordAt.getTime() / 1000, 10);
		return JWTTimeStamp < changedPasswordAt;
	}

	//False means password s not changed
	return false;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
