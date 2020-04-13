const express = require('express');
const authController = require('./../controllers/authController');

//Routers
const router = express.Router();

router.route('/').get(authController.protect, async (req, res) => {
	res.status(200).json({
		status: 'success',
		data: 'You have a Protected Route'
	});
});

module.exports = router;
