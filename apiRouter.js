const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const signup = require('./api/signup.js');
const login = require('./api/login.js');

module.exports = (dbClient, secret) => {
	const users = dbClient.collection('Users');

	function createCookie (email) {
		try {
			const iv = crypto.randomBytes(16);
			const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);
	
			let encrypted = cipher.update(email, 'utf8', 'hex');
			encrypted += cipher.final('hex');
			return Buffer.from(JSON.stringify({ data: encrypted, iv: iv })).toString('base64');
		} catch (error) {
			console.log(error);
			return undefined;
		}
	}

	router.post('/signup', async (req, res) => {
		signup(req, res, users, createCookie);
	});

	router.post('/login', async (req, res) => {
		login(req, res, users, createCookie);
	});

	return router;
};