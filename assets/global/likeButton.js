// eslint-disable-next-line
function like(id) {
	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/like', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

			const response = JSON.parse(this.response);

			if (response.success) {
				document.getElementById(`${id}-dislike-count`).innerHTML = parseInt(document.getElementById(`${id}-dislike-count`).innerHTML) + response.dislike;
				document.getElementById(`${id}-dislike-icon`).className = 'dislike-icon';
				document.getElementById(`${id}-like-count`).innerHTML = parseInt(document.getElementById(`${id}-like-count`).innerHTML) + response.like;
				
				if (response.like === 1) {
					document.getElementById(`${id}-like-icon`).className = 'like-icon-active';
				} else {
					document.getElementById(`${id}-like-icon`).className = 'like-icon';
				}

				document.getElementById(`${id}-indicator`).style.width =  parseInt(100 * parseInt(document.getElementById(`${id}-like-count`).innerHTML) / (parseInt(document.getElementById(`${id}-like-count`).innerHTML) + parseInt(document.getElementById(`${id}-dislike-count`).innerHTML))) + '%';
			}

		}
	};

	xhr.send(JSON.stringify({
		id
	}));
}