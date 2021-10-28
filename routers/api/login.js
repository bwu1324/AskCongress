const argon2 = require('argon2');

module.exports = async function (req, res, users, createCookie) {
	try {
		// check for user in database
		const found = await users.find({ email: req.body.email }).toArray();
		if (found.length === 1) {
			// verify password
			if (await argon2.verify(found[0].hash, req.body.password)) {
				// create and send cookie
				res.cookie('auth', createCookie(found[0]._id.toString()));
				res.send({
					success: true
				});
			}
			// otherwise, send error
			else {
				res.send({
					success: false,
					message: 'Username or password is incorrect'
				});
			}
		}
		else {
			res.send({
				success: false,
				message: 'Username or password is incorrect'
			});
		}
	} catch (error) {
		console.log(error);
		res.send({
			success: false,
			message: error
		});
	}
};