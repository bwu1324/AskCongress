// eslint-disable-next-line
function newResponse(id) {
	// grab form input
	const comment = document.getElementById(`new-comment-${id}`).value;
	const tooltip = document.getElementById(`new-comment-${id}-tooltip`);

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
			// otherwise reload the page
			else {
				window.location.reload();
			}
		}
	};

	xhr.send(JSON.stringify({
		comment,
		parent: id
	}));
}