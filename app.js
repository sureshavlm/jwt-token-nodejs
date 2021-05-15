
const express = require('express');

var db = require('./db');
var AuthController = require('./auth/AuthController');

const app = express();

app.use('/api/auth', AuthController);

app.get('/', (req, res) => {
	res.send("Welcome to JWT Token Demo");
});

module.exports = app;
