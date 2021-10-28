const path = require('path');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const signup = require(path.join(__dirname, 'api', 'signup.js'));
const login = require(path.join(__dirname, 'api', 'login.js'));
const newThread = require(path.join(__dirname, 'api', 'newThread.js'));

module.exports = (dbClient, secret) => {
	const users = dbClient.collection('Users');
	const threads = dbClient.collection('Threads');

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

	router.post('/signup', (req, res) => {
		signup(req, res, users, createCookie);
	});

	router.post('/login', (req, res) => {
		login(req, res, users, createCookie);
	});

	router.post('/newThread', (req, res) => {
		newThread(req, res, threads);

	})

	return router;
};