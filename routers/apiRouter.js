const path = require('path');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const getThread = require(path.join(__dirname, 'api', 'getThread.js'));
const getComments = require(path.join(__dirname, 'api', 'getComments.js'));
const signup = require(path.join(__dirname, 'api', 'signup.js'));
const login = require(path.join(__dirname, 'api', 'login.js'));
const newThread = require(path.join(__dirname, 'api', 'newThread.js'));
const newComment = require(path.join(__dirname, 'api', 'newComment.js'));
const like = require(path.join(__dirname, 'api', 'like.js'));
const dislike = require(path.join(__dirname, 'api', 'dislike.js'));

module.exports = (dbClient, secret) => {
	const users = dbClient.collection('Users');
	const threads = dbClient.collection('Threads');
	const comments = dbClient.collection('Comments');

	function createCookie(uid) {
		try {
			const iv = crypto.randomBytes(16);
			const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);

			let encrypted = cipher.update(uid, 'utf8', 'base64');
			encrypted += cipher.final('base64');
			return Buffer.from(JSON.stringify({ data: encrypted, iv: iv })).toString('base64');
		} catch (error) {
			console.log(error);
			return undefined;
		}
	}

	router.post('/getThread', (req, res) => {
		getThread(req, res, users, threads);
	});

	router.post('/getComments', (req, res) => {
		getComments(req, res, users, comments);
	});

	router.post('/signup', (req, res) => {
		signup(req, res, users, createCookie);
	});

	router.post('/login', (req, res) => {
		login(req, res, users, createCookie);
	});

	router.post('/newThread', (req, res) => {
		newThread(req, res, users, threads);
	});

	router.post('/newComment', (req, res) => {
		newComment(req, res, users, threads, comments);
	});

	router.post('/like', (req, res) => {
		like(req, res, threads, comments);
	});

	router.post('/dislike', (req, res) => {
		dislike(req, res, threads, comments);
	});

	return router;
};