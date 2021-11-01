var searchExclude = [];
function search(event, clear) {
	if (event) {
		// don't reload page
		event.preventDefault();
	}

	if (!clear) {
		document.getElementById('search-threads-container').innerHTML = '';
		searchExclude = [];
	}

	// grab form input
	const search = document.getElementById('searchBox').value;

	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/search', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

			const response = JSON.parse(this.response);

			document.getElementById('top-threads-header').innerHTML = 'Results for: ' + search;
			document.getElementById('top-thread-more').style.display = 'none';
			document.getElementById('search-thread-more').style.display = 'block';
			document.getElementById('top-threads-container').style.display = 'none';
			const parent = document.getElementById('search-threads-container');
			if (response.success) {
				for (let i = 0; i < response.threads.length; i++) {
					searchExclude.push(response.threads[i].threadId);
					parent.innerHTML += response.threads[i].thread;
				}
				if (!clear) {
					document.getElementById('scroll').scrollIntoView({
						behavior: 'smooth'
					});
				}
			}
		}
	};

	xhr.send(JSON.stringify({
		search,
		exclude: searchExclude
	}));
}

const form = document.getElementById('searchForm');
form.addEventListener('submit', search);