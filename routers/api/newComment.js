const { ObjectId } = require('mongodb');

module.exports = async function (req, res, users, threads, comments) {
	try {
		// check that user is signed in
		if (!req.isSignedIn) {
			res.send({
				success: false,
				error: 'login',
				message: 'An account is required to create a comment'
			});
			return;
		}

		// check for non empty body
		if (req.body.comment.length === 0) {
			res.send({
				success: false,
				error: 'body',
				message: 'Comment cannot be empty'
			});
			return;
		}

		// create new comment
		const createdDate = Date.now();
		const inserted = await comments.insertOne({
			UID: req.user._id,
			text: req.body.comment,
			comments: 0,
			commentIds: [],
			likes: 1,
			likedBy: [req.user._id],
			dislikes: 0,
			dislikedBy: [],
			created: createdDate
		});

		await threads.updateOne({ _id: ObjectId(req.body.threadId) }, {
			$push: {
				commentIds: {
					$each: [
						inserted.insertedId
					]
				}
			}
		});

		await comments.updateOne({ _id: ObjectId(req.body.threadId) }, {
			$push: {
				commentIds: {
					$each: [
						inserted.insertedId
					]
				}
			}
		});

		await users.updateOne({ _id: req.user._id }, {
			$push: {
				commentIds: {
					$each: [
						inserted.insertedId
					]
				}
			},
		});

		res.send({
			success: true,
			message: inserted.insertedId
		});
	} catch (error) {
		console.log(error);
		res.send({
			success: false,
			message: error
		});
	}
};