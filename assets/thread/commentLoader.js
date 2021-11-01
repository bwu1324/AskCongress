var openForm;
// eslint-disable-next-line
function showCommentForm(commentId) {
	if (openForm) {
		openForm.style.display = 'none';
	}
	if (commentId) {
		openForm = document.getElementById(`${commentId}-new-comment-form`);
		openForm.style.display = 'block';
	}
}

var exclude = [];
// eslint-disable-next-line
function commentLoader(parentId, commentIds, depth) {
	if (!depth) {
		depth = 0;
	}
	if (depth < 10) {
		// create new post req
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/getComments', true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.onreadystatechange = function () {
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				const response = JSON.parse(this.response);

				const parent = document.getElementById(parentId);
				// if sucessful, load comments if needed
				if (response.success) {
					for (let i = 0; i < response.comments.length; i++) {
						exclude.push(response.comments[i].commentId);
						parent.innerHTML += response.comments[i].comment;
						if (response.comments[i].commentIds.length > 0) {
							setTimeout(() => { commentLoader(response.comments[i].commentId, response.comments[i].commentIds, depth + 1); }, 100);
						}
					}
				}
				if (response.loadMore) {
					setTimeout(() => { commentLoader(parentId, commentIds); }, 100);
				}
			}
		};
		xhr.send(JSON.stringify({
			commentIds,
			exclude
		}));
	}
	else {
		const parent = document.getElementById(parentId);
		// eslint-disable-next-line
		parent.innerHTML += `<div id="comment-continue-link-container"><a id="comment-continue-link" href="/thread/${threadId}/${parentId}">See more replies ⟶</a></div>`;
	}
}