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
function taggedLoader(id) {
	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/getTagged', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			const response = JSON.parse(this.response);

			const parent = document.getElementById('tagged-container');

			// if sucessful, load comments if needed
			if (response.success) {
				for (let i = 0; i < response.threads.length; i++) {
					exclude.push(response.threads[i].threadId);
					parent.innerHTML += response.threads[i].thread;
				}
			}
			if (response.loadMore) {
				setTimeout(() => { taggedLoader(id); }, 100);
			}
		}
	};
	xhr.send(JSON.stringify({
		id,
		exclude
	}));
}