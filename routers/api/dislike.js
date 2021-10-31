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
			dislikedBy: [req.user._id]
		}, {
			projection: {
				_id: 1
			}
		});
		// if already liked, remove like
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
				message: 'removedLike'
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
			await threads.updateOne({ 
				_id: ObjectId(req.body.id),
				likedBy: [req.user._id]
			}, {
				$inc: {
					likes: -1
				},
				$pull: {
					likedBy: req.user._id
				}
			});
			
			res.send({
				success: true,
				message: 'addedLike'
			});
			return;
		}

		// then try comments
		const commentDisliked = await comments.findOne({ 
			_id: ObjectId(req.body.id),
			dislikedBy: [ req.user._id ]
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
				message: 'removedDislike'
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
			await comments.updateOne({ 
				_id: ObjectId(req.body.id),
				likedBy: [req.user._id]
			}, {
				$inc: {
					likes: -1
				},
				$pull: {
					likedBy: req.user._id
				}
			});
			
			res.send({
				success: true,
				message: 'addedDislike'
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