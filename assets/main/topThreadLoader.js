// eslint-disable-next-line
function topThreadLoader (threadId) {
	threadId = '617efa220a9ed362aa0fb53a';
	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/getThread', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			const response = JSON.parse(this.response);

			document.getElementById('top-threads-container').innerHTML += response.thread;
		}
	};
	xhr.send(JSON.stringify({
		threadId
	}));
}