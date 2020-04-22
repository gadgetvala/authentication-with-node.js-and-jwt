const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});
};

exports.signup = async (req, res) => {
	try {
		const newUser = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			passwordConfirm: req.body.passwordConfirm
		});

		const token = signToken(newUser._id);

		res.status(201).json({
			status: 'success',
			token,
			data: {
				user: newUser
			}
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err.message
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// 1) Check if email and password exits
		if (!email || !password) {
			throw new Error('Please provide email and password!');
		}

		// 2) Check if user exits && password is correct
		const user = await User.findOne({ email }).select('+password');

		if (!user || !(await user.correctPassword(password, user.password))) {
			throw new Error('Incorect email or password');
		}

		// 3) If everything is ok, send token to client
		const token = signToken(user._id);

		res.status(200).json({
			status: 'success',
			token
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err.message
		});
	}
};

exports.protect = async (req, res, next) => {
	try {
		// 1) Getting token and check if it's there
		let token;
		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			token = req.headers.authorization.split(' ')[1];
		}

		if (!token) {
			throw new Error('You are not logged in');
		}

		// 2) Verification token
		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

		// 3) Check if User still exists
		const freshUser = await User.findById(decoded.id);

		if (!freshUser) {
			throw new Error('The user belonging the token does no longer exists');
		}

		// 4) Check if user has changed the password  after the token was issued
		if (freshUser.changedPasswordAfter(decoded.iat)) {
			throw new Error('User has change the password recently');
		}

		//GRANT ACCESS TO PROTECTED ROUTE
		req.user = freshUser;
		next();
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err.message
		});
	}
};

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		try {
			if (!roles.includes(req.user.role)) {
				return throw new Error('You do not have premission to perform this action');
			}
			next();
		} catch (err) {
			res.status(403).json({
				status: 'fail',
				message: err.message
			});
		}
	};
};
