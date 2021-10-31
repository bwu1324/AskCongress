module.exports = async function (req, res, users, threads) {
	try {
		// check that user is signed in
		if (!req.isSignedIn) {
			res.send({
				success: false,
				error: 'login',
				message: 'An account is required to create a new thread'
			});
			return;
		}

		// check for non empty title and body
		// title
		if (req.body.title.length === 0) {
			res.send({
				success: false,
				error: 'title',
				message: 'Title cannot be empty'
			});
			return;
		}
		// body
		if (req.body.body.length === 0) {
			res.send({
				success: false,
				error: 'body',
				message: 'Body cannot be empty'
			});
			return;
		}

		// create new thread
		const createdDate = Date.now();
		const inserted = await threads.insertOne({
			UID: req.user._id,
			title: req.body.title,
			body: req.body.body,
			comments: 0,
			commentIds: [],
			likes: 1,
			likedBy: [req.user._id],
			dislikes: 0,
			dislikedBy: [],
			created: createdDate
		});

		await users.updateOne({ _id: req.user._id }, {
			$push: {
				threadIds: {
					$each: [
						inserted.insertedId
					]
				}
			},
		});

		res.send({
			success: true,
			message: inserted.insertedId.toString()
		});
	} catch (error) {
		console.log(error);
		res.send({
			success: false,
			error: 'unkown',
			message: error
		});
	}
};