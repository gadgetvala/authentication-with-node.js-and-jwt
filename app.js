const express = require('express');
const userRoute = require('./routes/userRoute');
const tourRoute = require('./routes/tourRoute');

const app = express();

//Middleware
app.use(express.json());
app.use('/api/v1/users', userRoute);
app.use('/api/v1/tour', tourRoute);

//Handling unexpected routes
app.all('*', (req, res, next) => {
	res.status(404).json({
		status: 'fail',
		message: `Can't find ${req.originalUrl} on this server`
	});

	next(err);
});

module.exports = app;
