const { ObjectId } = require('mongodb');
const ejs = require('ejs');
const path = require('path');

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

			var liked = false;
			var disliked = false;
			if (req.isSignedIn) {
				var foundLike = await threads.findOne({ 
					_id: ObjectId(thread._id),
					likedBy: req.user._id
				});

				var foundDisliked = await threads.findOne({ 
					_id: ObjectId(thread._id),
					dislikedBy: req.user._id
				});

				if (foundLike) {
					liked = true;
				}
				if (foundDisliked) {
					disliked = true;
				}
			}

			const result = {
				notFound: false,
				threadId: req.body.threadId,
				user: {
					id: user._id.toString(),
					username: user.username
				},
				title: thread.title,
				body: thread.body,
				comments: thread.comments,
				likes: thread.likes,
				dislikes: thread.dislikes,
				created: thread.created,
				tagged: thread.tagged,
				liked,
				disliked
			};
			const threadBlock = await ejs.renderFile(path.join(__dirname, '..', '..', 'views', 'templates', 'threadBlock.ejs'), result);
			res.send({
				success: true,
				thread: threadBlock,
				commentIds
			});
		} else {
			const threadBlock = await ejs.renderFile(path.join(__dirname, '..', '..', 'views', 'templates', 'threadBlock.ejs'), { notFound: true });
			res.send({
				success: false,
				thread: threadBlock
			});
		}
	} catch (error) {
		console.log(error);
		const threadBlock = await ejs.renderFile(path.join(__dirname, '..', '..', 'views', 'templates', 'threadBlock.ejs'), { notFound: true });
		res.send({
			success: false,
			thread: threadBlock
		});
	}
};