const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION!    Shutting Down...');
	console.log(err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => console.log('DB connections succesfull'));

const server = app.listen(process.env.PORT, () => {
	console.log(`Server Is started at port ${process.env.PORT}`);
});

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLER REJECTIONS!    Shutting Down...');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
