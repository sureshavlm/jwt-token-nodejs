
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
	name: { type: String, unique: true },
	password: { type: String },
	email: { type: String, unique: true }
});

module.exports = mongoose.model('user', userSchema);