// eslint-disable-next-line
var threadId;
// eslint-disable-next-line
function setThreadId(id) {
	threadId = id;
}

// eslint-disable-next-line
function threadLoader (threadId, loadComment) {
	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/getThread', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			const response = JSON.parse(this.response);

			document.getElementById('thread').innerHTML = response.thread + document.getElementById('thread').innerHTML;
			// if sucessful, load comments if needed
			if (response.success) {
				if (loadComment === 'all') {
					// eslint-disable-next-line
					commentLoader('comments-container', response.commentIds);
				} else if (loadComment !== '') {
					// eslint-disable-next-line
					commentLoader('comments-container', [loadComment]);
				}
			}
		}
	};
	xhr.send(JSON.stringify({
		threadId
	}));
}