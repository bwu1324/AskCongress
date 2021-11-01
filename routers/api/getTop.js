const { ObjectId } = require('mongodb');
const ejs = require('ejs');
const path = require('path');

module.exports = async function (req, res, users, threads) {
	try {
		for (let i = 0; i < req.body.exclude.length; i++) {
			req.body.exclude[i] = ObjectId(req.body.exclude[i]);
		}

		const found = await threads.find({
			_id: {
				$not: {
					$in: req.body.exclude
				}
			}
		}).limit(20).sort({
			likes: -1
		}).toArray();

		const foundThreads = [];
		for (let i = 0; i < found.length; i++) {
			let user = await users.findOne({ _id: found[i].UID }, {
				projection: {
					_id: 1,
					username: 1
				}
			});

			var liked = false;
			var disliked = false;
			if (req.isSignedIn) {
				var foundLike = await threads.findOne({ 
					_id: ObjectId(found[i]._id),
					likedBy: req.user._id
				});

				var foundDisliked = await threads.findOne({ 
					_id: ObjectId(found[i]._id),
					dislikedBy: req.user._id
				});

				if (foundLike) {
					liked = true;
				}
				if (foundDisliked) {
					disliked = true;
				}
			}

			let info = {
				notFound: false,
				threadId: found[i]._id.toString(),
				user: {
					id: user._id.toString(),
					username: user.username
				},
				title: found[i].title,
				body: found[i].body,
				comments: found[i].comments,
				likes: found[i].likes,
				dislikes: found[i].dislikes,
				created: found[i].created,
				tagged: found[i].tagged,
				liked,
				disliked
			};

			let threadBlock = await ejs.renderFile(path.join(__dirname, '..', '..', 'views', 'templates', 'threadBlock.ejs'), info);

			for (let j = 0; j < found[i].commentIds.length; j++) {
				found[i].commentIds[j] = found[i].commentIds[j].toString();
			}

			foundThreads.push({
				threadId: info.threadId,
				thread: threadBlock
			});
		}

		res.send({
			success: true,
			threads: foundThreads,
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