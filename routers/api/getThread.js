const { ObjectId } = require('mongodb');

module.exports = async function (req, res, users, threads) {
	try {
		const thread = await threads.findOne({ _id: ObjectId(req.body.threadId) });
		if (thread) {
			const user = await users.findOne({ _id: thread.UID }, {
				projection: {
					_id: 1,
					username: 1
				}
			});

			var commentIds = [];
			for (let i = 0; i < thread.commentIds.length; i++) {
				commentIds.push(thread.commentIds[i].toString());
			}

			res.send({
				user: {
					id: user._id.toString(),
					username: user.username
				},
				title: thread.title,
				body: thread.body,
				comments: thread.comments,
				commentIds: commentIds,
				likes: thread.likes,
				created: thread.created
			});
		} else {
			res.send({
				success: false,
				message: 'Thread not found'
			});
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