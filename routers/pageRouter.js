const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('pages/main', { isSignedIn: req.isSignedIn, user: req.user });
});

router.get('/about', (req, res) => {
	res.render('pages/about', { isSignedIn: req.isSignedIn, user: req.user });
});

router.get('/login', (req, res) => {
	if (!req.isSignedIn) {
		res.render('pages/login', { isSignedIn: req.isSignedIn, user: req.user });
	}
	else {
		res.redirect('/');
	}
});

router.get('/signup', (req, res) => {
	if (!req.isSignedIn) {
		res.render('pages/signup', { isSignedIn: req.isSignedIn, user: req.user });
	}
	else {
		res.redirect('/');
	}
});

router.get('/newThread', (req, res) => {
	res.render('pages/newThread', { isSignedIn: req.isSignedIn, user: req.user });
});

router.get('/thread/:threadId', (req, res) => {
	res.render('pages/thread', { 
		isSignedIn: req.isSignedIn, 
		user: req.user, 
		threadId: req.params.threadId,
		commentId: false
	});
});

router.get('/thread/:threadId/:commentId', (req, res) => {
	res.render('pages/thread', { 
		isSignedIn: req.isSignedIn, 
		user: req.user, 
		threadId: req.params.threadId, 
		commentId: req.params.commentId 
	});
});

router.get('/members', (req, res) => {
	res.render('pages/members', { isSignedIn: req.isSignedIn, user: req.user });
});

router.get('/respond', (req, res) => {
	res.render('pages/respond', { isSignedIn: req.isSignedIn, user: req.user });
});

module.exports = router;