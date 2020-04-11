const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});
};

exports.signup = async (req, res) => {
	try {
		const newUser = User.create({
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
			message: err
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// 1) Check if email and password exits
		if (!email || !password) {
			return new Error('Please provide email and password!');
		}

		// 2) Check if user exits && password is correct
		const user = await User.findOne({ email }).select('+password');

		if (!user || !(await user.correctPassword(password, user.password))) {
			return new Error('Incorect email or password');
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
			message: err
		});
	}
};
