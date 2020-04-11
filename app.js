const express = require('express');
const userRoute = require('./routes/userRoute');

const app = express();

//Middleware
app.use(express.json());
app.use('/api/v1/users', userRouter);

//Handling unexpected routes
app.all('*', (req, res, next) => {
	res.status(404).json({
		status: 'fail',
		message: `Can't find ${req.originalUrl} on this server`
	});
	const err = new Error(`Can't find ${req.originalUrl} on this server`);
	err.status = 'fail';
	err.statusCode = 404;

	next(err);
});

module.exports = app;
