const express = require('express');
const router = express.Router();

router.get('/main', (req, res) => {
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
		res.redirect('/main');
	}
});

router.get('/signup', (req, res) => {
	if (!req.isSignedIn) {
		res.render('pages/signup', { isSignedIn: req.isSignedIn, user: req.user });
	}
	else {
		res.redirect('/main');
	}
});

router.get('/signout', (req, res) => {
	res.clearCookie('auth');
	res.redirect('/main');
});

router.get('/newThread', (req, res) => {
	res.render('pages/newThread', { isSignedIn: req.isSignedIn, user: req.user });
});

router.get('/thread/:threadId', (req, res) => {
	res.render('pages/thread', { 
		isSignedIn: req.isSignedIn, 
		user: req.user, 
		threadId: req.params.threadId,
		loadComment: 'all'
	});
});

router.get('/thread/:threadId/:commentId', (req, res) => {
	res.render('pages/thread', { 
		isSignedIn: req.isSignedIn, 
		user: req.user, 
		threadId: req.params.threadId, 
		loadComment: req.params.commentId
	});
});

router.get('/respond', (req, res) => {
	res.render('pages/respond', { isSignedIn: req.isSignedIn, user: req.user });
});

module.exports = router;