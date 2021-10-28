function login(event) {
	// don't reload page
	event.preventDefault();

	// grab form input
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	const tooltip = document.getElementById('tooltip');

	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/login', true);
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
			// otherwise reload the page (will be redirected if logged in properly)
			else {
				window.location.reload();
			}
		}
	};

	xhr.send(JSON.stringify({
		email,
		password
	}));
}

const form = document.getElementById('loginForm');
form.addEventListener('submit', login);