const path = require('path');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const { ObjectId } = require('mongodb');

// starts the web server
function start(dbClient, secret) {
	// get users database for isSignedIn middleware
	const users = dbClient.collection('Users');

	// log time, remote user, and path to console
	function logger(req, res, next) {
		console.log(`[${Date.now()}] ${req.ip} - ${req.method} request for: ${req.path}`);
		next();
	}

	// checks request's 'auth' cookie and determines if it is valid or not
	//		if valid, req.isSignedIn = true; and req.user = <user object>
	//		if invalid, req.isSignedIn = false; and req.user = undefined
	async function isSignedIn(req, res, next) {
		req.isSignedIn = false;
		try {
			if (req.cookies['auth']) {
				// decrypt cookie
				const cookie = JSON.parse(Buffer.from(req.cookies['auth'], 'base64').toString('ascii'));
				const iv = Buffer.from(cookie.iv);
				const decipher = crypto.createDecipheriv('aes-256-cbc', secret, iv);
				let decrypted = decipher.update(cookie.data, 'hex', 'utf8');
				decrypted += decipher.final('utf8');
				
				// search for user in database
				const user = await users.find({ _id: ObjectId(decrypted) }).toArray();

				// only authenticate is exactly 1 user is returned
				if (user.length === 1) {
					req.isSignedIn = true;
					req.user = user;
				}
			}
		} catch (error) {
			console.log(error);
		}
		next();
	}

	// grab page routers and pass in database client
	const pageRouter = require(path.join(__dirname, 'routers', 'pageRouter.js'));
	const apiRouter = require(path.join(__dirname, 'routers', 'apiRouter.js'))(dbClient, secret);

	// set up express
	app.set('view engine', 'ejs');
	app.use(express.static(path.join(__dirname, 'assets')));
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