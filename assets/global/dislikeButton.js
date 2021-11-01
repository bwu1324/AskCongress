// eslint-disable-next-line
function dislike(id) {
	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/dislike', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

			const response = JSON.parse(this.response);

			if (response.success) {
				document.getElementById(`${id}-like-count`).innerHTML = parseInt(document.getElementById(`${id}-like-count`).innerHTML) + response.like;
				document.getElementById(`${id}-like-icon`).className = 'like-icon';
				document.getElementById(`${id}-dislike-count`).innerHTML = parseInt(document.getElementById(`${id}-dislike-count`).innerHTML) + response.dislike;
				
				if (response.dislike === 1) {
					document.getElementById(`${id}-dislike-icon`).className = 'dislike-icon-active';
				} else {
					document.getElementById(`${id}-dislike-icon`).className = 'dislike-icon';
				}

				document.getElementById(`${id}-indicator`).style.width =  parseInt(100 * parseInt(document.getElementById(`${id}-like-count`).innerHTML) / (parseInt(document.getElementById(`${id}-like-count`).innerHTML) + parseInt(document.getElementById(`${id}-dislike-count`).innerHTML))) + '%';
			}
			else {
				if (response.error === 'login') {
					document.getElementById(`like-${id}-tooltip`).innerHTML = response.message;
					document.getElementById(`like-${id}-tooltip`).style.display = 'block';
				}
			}
		}
	};

	xhr.send(JSON.stringify({
		id
	}));
}