const User = require('./../models/userModel');

exports.signup = async (req, res) => {
	try {
		const newUser = User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			passwordConfirm: req.body.passwordConfirm
		});

		res.status(201).json({
			status: 'success',
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
