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

			let liked = false;
			for (let i = 0; i < thread.likedBy.length; i++) {
				if (thread.likedBy[i].toString() === req.user._id.toString()) {
					liked = true;
					break;
				}
			}

			let disliked = false;
			for (let i = 0; i < thread.dislikedBy.length; i++) {
				if (thread.dislikedBy[i].toString() === req.user._id.toString()) {
					disliked = true;
					break;
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