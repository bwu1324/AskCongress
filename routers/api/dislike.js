const { ObjectId } = require('mongodb');

module.exports = async function (req, res, threads, comments) {
	try {
		// check that user is signed in
		if (!req.isSignedIn) {
			res.send({
				success: false,
				error: 'login',
				message: 'An account is required to dislike'
			});
			return;
		}

		// try threads first
		const threadDisliked = await threads.findOne({
			_id: ObjectId(req.body.id),
			dislikedBy: req.user._id
		}, {
			projection: {
				_id: 1
			}
		});
		if (threadDisliked) {
			await threads.updateOne({ _id: ObjectId(req.body.id) }, {
				$inc: {
					dislikes: -1
				},
				$pull: {
					dislikedBy: req.user._id
				}
			});
			res.send({
				success: true,
				like: 0,
				dislike: -1
			});
			return;
		}

		const threadNotDisliked = await threads.findOne({ _id: ObjectId(req.body.id) }, {
			projection: {
				_id: 1
			}
		});
		// if not disliked, add dislike
		if (threadNotDisliked) {
			await threads.updateOne({ _id: ObjectId(req.body.id) }, {
				$inc: {
					dislikes: 1
				},
				$push: {
					dislikedBy: req.user._id
				}
			});

			// remove like if liked
			var removedLike = await threads.updateOne({ 
				_id: ObjectId(req.body.id),
				likedBy: req.user._id
			}, {
				$inc: {
					likes: -1
				},
				$pull: {
					likedBy: req.user._id
				}
			});
			if (removedLike.modifiedCount === 1) {
				removedLike = -1;
			}
			else {
				removedLike = 0;
			}
			
			res.send({
				success: true,
				like: removedLike,
				dislike: 1
			});
			return;
		}

		// then try comments
		const commentDisliked = await comments.findOne({ 
			_id: ObjectId(req.body.id),
			dislikedBy: req.user._id
		}, {
			projection: {
				_id: 1
			}
		});
		// if already disliked, remove dislike
		if (commentDisliked) {
			await comments.updateOne({ _id: ObjectId(req.body.id) }, {
				$inc: {
					dislikes: -1
				},
				$pull: {
					dislikedBy: req.user._id
				}
			});

			res.send({
				success: true,
				like: 0,
				dislike: -1
			});
			return;
		}

		const commentNotDisliked = await comments.findOne({ _id: ObjectId(req.body.id) }, {
			projection: {
				_id: 1
			}
		});
		// if not disliked, add dislike
		if (commentNotDisliked) {
			await comments.updateOne({ _id: ObjectId(req.body.id) }, {
				$inc: {
					dislikes: 1
				},
				$push: {
					dislikedBy: req.user._id
				}
			});
			// remove like if liked
			removedLike = await comments.updateOne({ 
				_id: ObjectId(req.body.id),
				likedBy: req.user._id
			}, {
				$inc: {
					likes: -1
				},
				$pull: {
					likedBy: req.user._id
				}
			});
			if (removedLike.modifiedCount === 1) {
				removedLike = -1;
			}
			else {
				removedLike = 0;
			}

			res.send({
				success: true,
				like: removedLike,
				dislike: 1
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