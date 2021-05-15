var mongoose = require('mongoose');
var chalk = require('chalk');

mongoose.connect('mongodb://localhost:27017/apr21jwt', 
	{ useNewUrlParser: true, 
	  useUnifiedTopology: true,
	  useCreateIndex: true });


mongoose.connection.on('connected', () => {
	console.log(chalk.green('Connected to DB'));
});

mongoose.connection.on('disconnected', () => {
	console.log(chalk.yellow('Disconnected from DB'));
});

mongoose.connection.on('error', () => {
	console.log(chalk.red('Error connecting to DB'));
});