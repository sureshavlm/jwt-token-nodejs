const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var User = require('../user/user');
var config = require('../sconfig');

var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false}));

router.post('/register', (req, res) => {
	console.log(' Request Body: ',req.body);
	//encrypt the password and create a user in db
	var hashedPasswod = bcrypt.hashSync(req.body.password, 8);
	console.log(' hashedPasswod: ',hashedPasswod);
	
	User.create({
		name: req.body.name,
		email: req.body.email,
		password: hashedPasswod
	}, (err, user) => {
		console.log('Error', err);
		if(err) {
			return res.status(500).send('Thee was a problem while registeing use.');
		}		
		res.status(200).send('Registration completed!');
	});
});

router.post('/login', (req, res) => {
	//if credentials matches generate a jwt token and send to client
	User.findOne({ email: req.body.email }, (err, user) => {
		if(err)
			return res.status(500).send('Error on the sever');
		if(!user)
			return res.status(404).send('No use found.');

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if(!passwordIsValid) return res.status(401).send({ auth: false, token: null });

		var token = jwt.sign({ id: user._id }, config.secret, { expiresIn : 86400 } );

		res.status(200).send({ auth: true, token: token });
	});
});

router.get('/validate', (req, res) => {
	//verify the token validty and send user data
	var token = req.headers['x-access-token'];
	if(!token)
		return res.status(401).send('No token povided.');
	jwt.verify(token, config.secret, (err, decoded) => {
		if(err)
			return res.status(500).send({ auth: false, message: 'Failed ot authenticate' });
		User.findById(decoded.id, { password: 0 }, (err, user) => {
			if(err)
				return res.status(500).send('There was some problem');
			if(!user)
				return res.status(404).send('No use found.');
			
		res.status(200).send(user);
		});
	});

});

module.exports = router;