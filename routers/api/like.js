const { ObjectId } = require('mongodb');

module.exports = async function (req, res, threads, comments) {
	try {
		// check that user is signed in
		if (!req.isSignedIn) {
			res.send({
				success: false,
				error: 'login',
				message: 'An account is required to like'
			});
			return;
		}

		// try threads first
		const threadLiked = await threads.findOne({
			_id: ObjectId(req.body.id),
			likedBy: req.user._id
		}, {
			projection: {
				_id: 1
			}
		});

		// if already liked, remove like
		if (threadLiked) {
			await threads.updateOne({ _id: ObjectId(req.body.id) }, {
				$inc: {
					likes: -1
				},
				$pull: {
					likedBy: req.user._id
				}
			});
			res.send({
				success: true,
				like: -1,
				dislike: 0
			});
			return;
		}

		const threadNotLiked = await threads.findOne({ _id: ObjectId(req.body.id) }, {
			projection: {
				_id: 1
			}
		});
		// if not liked, add like
		if (threadNotLiked) {
			await threads.updateOne({ _id: ObjectId(req.body.id) }, {
				$inc: {
					likes: 1
				},
				$push: {
					likedBy: req.user._id
				}
			});

			// remove dislike if disliked
			var removedDislike = await threads.updateOne({ 
				_id: ObjectId(req.body.id),
				dislikedBy: req.user._id
			}, {
				$inc: {
					dislikes: -1
				},
				$pull: {
					dislikedBy: req.user._id
				}
			});
			if (removedDislike.modifiedCount === 1) {
				removedDislike = -1;
			}
			else {
				removedDislike = 0;
			}

			res.send({
				success: true,
				like: 1,
				dislike: removedDislike
			});
			return;
		}

		// then try comments
		const commentLiked = await comments.findOne({
			_id: ObjectId(req.body.id),
			likedBy: req.user._id
		}, {
			projection: {
				_id: 1
			}
		});
		// if already liked, remove like
		if (commentLiked) {
			await comments.updateOne({ _id: ObjectId(req.body.id) }, {
				$inc: {
					likes: -1
				},
				$pull: {
					likedBy: req.user._id
				}
			});
			res.send({
				success: true,
				like: -1,
				dislike: 0
			});
			return;
		}

		const commentNotLiked = await comments.findOne({ _id: ObjectId(req.body.id) }, {
			projection: {
				_id: 1
			}
		});
		// if not liked, add like
		if (commentNotLiked) {
			await comments.updateOne({ _id: ObjectId(req.body.id) }, {
				$inc: {
					likes: 1
				},
				$push: {
					likedBy: req.user._id
				}
			});
			// remove dislike if disliked
			removedDislike = await comments.updateOne({ 
				_id: ObjectId(req.body.id),
				dislikedBy: req.user._id
			}, {
				$inc: {
					dislikes: -1
				},
				$pull: {
					dislikedBy: req.user._id
				}
			});
			if (removedDislike.modifiedCount === 1) {
				removedDislike = -1;
			}
			else {
				removedDislike = 0;
			}

			res.send({
				success: true,
				like: 1,
				dislike: removedDislike
			});
			return;
		}
	} catch (error) {
		console.log(error);
		res.send({
			success: false,
			error: 'unkown',
			message: error
		});
	}
};