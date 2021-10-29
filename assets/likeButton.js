// eslint-disable-next-line
function like(id) {
	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/like', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

			const response = JSON.parse(this.response);

			// if not successful, show tooltip for reason
			if (!response.success) {
				// response.message = "addedLike" or "removedLike"
			}
		}
	};

	xhr.send(JSON.stringify({
		id
	}));
}