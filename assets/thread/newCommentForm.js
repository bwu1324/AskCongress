function newComment(event) {
	// don't reload page
	event.preventDefault();

	// grab form input
	const comment = document.getElementById('comment').value;
	const threadId = document.getElementById('thread-id').innerHTML;
	const tooltip = document.getElementById('tooltip');

	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/newComment', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			tooltip.style.display = 'none';

			const response = JSON.parse(this.response);

			// if not successful, show tooltip for reason
			if (!response.success) {
				tooltip.innerHTML = response.message;
				tooltip.style.display = 'block';
			}
			// otherwise redirect to comment page
			else {
				window.location.href = `/thread/${threadId}/${response.message}`;
			}
		}
	};

	xhr.send(JSON.stringify({
		comment,
		parent: threadId
	}));
}

const form = document.getElementById('newCommentForm');
form.addEventListener('submit', newComment);