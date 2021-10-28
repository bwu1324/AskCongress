const argon2 = require('argon2');
const emailValidator = require('deep-email-validator');

module.exports = async (req, res, users, createCookie) => {
	try {
		// check for valid username, password, and emails
		// username length
		if (req.body.username.length < 5) {
			res.send({
				success: false,
				error: 'username',
				message: 'Username must be at least 5 characters'
			});
			return;
		}

		// email formatting
		const validEmail = await emailValidator.validate({
			email: req.body.email,
			validateRegex: true,
			validateMx: false,
			validateTypo: false,
			validateDisposable: true,
			validateSMTP: false,
		});
		if (!validEmail.valid) {
			res.send({
				success: false,
				error: 'email',
				message: 'Enter a valid email'
			});
			return;
		}

		// if email exists already or not
		const existingUsers = await users.find({ email: req.body.email }).toArray();
		if (existingUsers.length !== 0) {
			res.send({
				success: false,
				error: 'email',
				message: 'Account with this email already exists'
			});
			return;
		}

		// password length
		if (req.body.password.length < 5) {
			res.send({
				success: false,
				error: 'password',
				message: 'Password must be at least 5 characters'
			});
			return;
		}

		// hash password
		const hash = await argon2.hash(req.body.password);
		const inserted = await users.insertOne({
			username: req.body.username,
			email: req.body.email,
			hash: hash
		});
		
		// create session cookie
		res.cookie('auth', createCookie(inserted.insertedId.toString()));
		res.send({
			success: true
		});
	} catch (error) {
		console.log(error);
		res.send({
			success: false,
			error: 'password',
			message: error
		});
	}
};