var exclude = [];
// eslint-disable-next-line
function commentLoader(parentId, commentIds, depth) {
	if (!depth) {
		depth = 5;
	}
	if (depth < 5) {
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
							commentLoader(response.comments[i].commentId, response.comments[i].commentIds, depth + 1);
						}
					}
				}
			}
		};
		xhr.send(JSON.stringify({
			commentIds,
			exclude
		}));
	}
}