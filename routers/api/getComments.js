const { ObjectId } = require('mongodb');
const ejs = require('ejs');
const path = require('path');

module.exports = async function (req, res, users, comments) {
	try {
		for (let i = 0; i < req.body.commentIds.length; i++) {
			req.body.commentIds[i] = ObjectId(req.body.commentIds[i]);
		}
		for (let i = 0; i < req.body.exclude.length; i++) {
			req.body.exclude[i] = ObjectId(req.body.exclude[i]);
		}
		
		const found = await comments.find({
			_id: {
				$in: req.body.commentIds,
				$not: {
					$in: req.body.exclude
				}
			}
		}).limit(20).sort({
			likes: -1
		}).toArray();

		const foundComments = [];
		for (let i = 0; i < found.length; i++) {
			let user = await users.findOne({ _id: found[i].UID }, {
				projection: {
					_id: 1,
					username: 1
				}
			});

			let liked = false;
			for (let j = 0; j < found[i].likedBy.length; j++) {
				if (found[i].likedBy[j].toString() === req.user._id.toString()) {
					liked = true;
					break;
				}
			}

			let disliked = false;
			for (let j = 0; j < found[i].dislikedBy.length; j++) {
				if (found[i].dislikedBy[j].toString() === req.user._id.toString()) {
					disliked = true;
					break;
				}
			}

			let info = {
				commentId: found[i]._id.toString(),
				user: {
					id: user._id.toString(),
					username: user.username
				},
				text: found[i].text,
				comments: found[i].comments,
				likes: found[i].likes,
				dislikes: found[i].dislikes,
				created: found[i].created,
				liked,
				disliked
			};
			
			let commentBlock = await ejs.renderFile(path.join(__dirname, '..', '..', 'views', 'templates', 'commentBlock.ejs'), info);

			for (let j = 0; j < found[i].commentIds.length; j++) {
				found[i].commentIds[j] = found[i].commentIds[j].toString();
			}

			foundComments.push({
				commentId: info.commentId,
				comment: commentBlock,
				commentIds: found[i].commentIds
			});
		}

		res.send({
			success: true,
			comments: foundComments
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