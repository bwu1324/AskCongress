const argon2 = require('argon2');

module.exports = async function (req, res, users, createCookie) {
	try {
		// check for user in database
		const found = await users.findOne({ email: req.body.email }, {
			projection: {
				username: 1,
				hash: 1
			}
		});
		if (found) {
			// verify password
			if (await argon2.verify(found.hash, req.body.password)) {
				// create and send cookie
				res.cookie('auth', createCookie(found._id.toString()));
				res.send({
					success: true
				});
			}
			// otherwise, send error
			else {
				res.send({
					success: false,
					error: 'auth',
					message: 'Username or password is incorrect'
				});
			}
		}
		else {
			res.send({
				success: false,
				error: 'auth',
				message: 'Username or password is incorrect'
			});
		}
	} catch (error) {
		console.log(error);
		res.send({
			success: false,
			error: 'unknown',
			message: error
		});
	}
};