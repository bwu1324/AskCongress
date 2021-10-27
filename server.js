const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

function start(dbClient, secret) {
	const users = dbClient.collection('Users');

	function logger(req, res, next) {
		console.log(`[${Date.now()}] ${req.ip} - ${req.method} request for: ${req.path}`);
		next();
	}
	async function isSignedIn(req, res, next) {
		req.isSignedIn = false;
		try {
			if (req.cookies['auth']) {
				const cookie = JSON.parse(Buffer.from(req.cookies['auth'], 'base64').toString('ascii'));
				const iv = Buffer.from(cookie.iv);
				const decipher = crypto.createDecipheriv('aes-256-cbc', secret, iv);

				let decrypted = decipher.update(cookie.data, 'hex', 'utf8');
				decrypted += decipher.final('utf8');

				const user = await users.find({ email: decrypted }).toArray();
				if (user.length === 1) {
					req.isSignedIn = true;
				}
			}
		} catch (error) {
			console.log(error);
		}
		next();
	}

	// grab page routers and pass in database client
	const pageRouter = require('./pageRouter.js');
	const apiRouter = require('./apiRouter.js')(dbClient, secret);

	// set up express
	app.set('view engine', 'ejs');
	app.use(express.static('./assets'));
	app.use(express.json());
	app.use(cookieParser());
	app.use(logger);
	app.use(isSignedIn);
	app.use(pageRouter);
	app.use(apiRouter);

	// listen on port 8080
	app.listen(8080);
}

module.exports = { start };