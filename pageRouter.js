const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('pages/main', { isSignedIn: req.isSignedIn });
});

router.get('/about', (req, res) => {
	res.render('pages/about', { isSignedIn: req.isSignedIn });
});

router.get('/login', (req, res) => {
	if (!req.isSignedIn) {
		res.render('pages/login', { isSignedIn: req.isSignedIn });
	}
	else {
		res.redirect('/');
	}
});

router.get('/signup', (req, res) => {
	if (!req.isSignedIn) {
		res.render('pages/signup', { isSignedIn: req.isSignedIn });
	}
	else {
		res.redirect('/');
	}
});

router.get('/thread/:threadId', (req, res) => {
	console.log(req.params.threadId);
	res.render('pages/thread', { isSignedIn: req.isSignedIn });
});

router.get('/members', (req, res) => {
	res.render('pages/members', { isSignedIn: req.isSignedIn });
});

router.get('/respond', (req, res) => {
	res.render('pages/respond', { isSignedIn: req.isSignedIn });
});

module.exports = router;