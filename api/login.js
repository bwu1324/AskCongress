const argon2 = require('argon2');

module.exports = async function (req, res, users, createCookie) {
	try {
		const user = await users.find({ email: req.body.email }).toArray();
		if (user.length === 1) {
			if (await argon2.verify(user[0].hash, req.body.password)) {
				res.cookie('auth', createCookie(req.body.email));
				res.send({
					success: true
				});
			}
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