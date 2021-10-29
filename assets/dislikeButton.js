// eslint-disable-next-line
function dislike(id) {
	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/dislike', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

			const response = JSON.parse(this.response);

			// if not successful, show tooltip for reason
			if (!response.success) {
				// response.message = "addedDislike" or "removedDislike"
			}
		}
	};

	xhr.send(JSON.stringify({
		id
	}));
}