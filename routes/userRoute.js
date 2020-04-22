const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//Routers
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/').get(userController.getAllUsers);

/**
Only Admin can delete user:
**/
//router.route('/').delete(authController.protect, authController.restrictTo('admin'), user controller)

module.exports = router;
