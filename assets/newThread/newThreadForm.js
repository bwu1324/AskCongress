var tagged = [];
// eslint-disable-next-line
function updateTags() {
	const selector = document.getElementById('add-tag');
	const taggedContainer = document.getElementById('tagged-container');

	if (selector.value && tagged.indexOf(selector.value) === -1) {
		tagged.push(selector.value);
		taggedContainer.innerHTML +=
			`<div class="tagged" id="${selector.value}">
				<p>${selector.value}</p>
				<button class="remove-tag" onclick="removeTag('${selector.value}')">x</button>
			</div>`;
	}
	selector.value = '';
}

// eslint-disable-next-line
function removeTag(tag) {
	const index = tagged.indexOf(tag);
	if (index !== -1) {
		tagged.splice(index, 1);
		document.getElementById(tag).remove();
	}
}

// eslint-disable-next-line
function newThread() {
	// grab form input
	const title = document.getElementById('title').value;
	const body = document.getElementById('body').value;

	const titleTooltip = document.getElementById('title-tooltip');
	const bodyTooltip = document.getElementById('body-tooltip');

	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/newThread', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			titleTooltip.style.display = 'none';

			const response = JSON.parse(this.response);

			// if not successful, show tooltip for reason
			if (!response.success) {
				if (response.error === 'title') {
					titleTooltip.innerHTML = response.message;
					titleTooltip.style.display = 'block';
				} else {
					bodyTooltip.innerHTML = response.message;
					bodyTooltip.style.display = 'block';
				}
			}
			// otherwise redirect to thread page
			else {
				window.location.href = `/thread/${response.message}`;
			}
		}
	};

	xhr.send(JSON.stringify({
		title,
		body,
		tagged
	}));
}