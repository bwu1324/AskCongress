function signup(event) {
	// don't reload page
	event.preventDefault();

	// grab form input
	const username = document.getElementById('username').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	const passwordTooltip = document.getElementById('password-tooltip');
	const emailTooltip = document.getElementById('email-tooltip');
	const usernameTooltip = document.getElementById('username-tooltip');

	// create new post req
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/signup', true);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			passwordTooltip.style.display = 'none';
			emailTooltip.style.display = 'none';
			usernameTooltip.style.display = 'none';

			const response = JSON.parse(this.response);

			if (!response.success) {
				if (response.error == 'username') {
					usernameTooltip.innerHTML = response.message;
					usernameTooltip.style.display = 'block';
				}
				else if (response.error == 'password') {
					passwordTooltip.innerHTML = response.message;
					passwordTooltip.style.display = 'block';
				}
				else if (response.error == 'email') {
					emailTooltip.innerHTML = response.message;
					emailTooltip.style.display = 'block';
				}
			}
			else {
				window.location.reload();
			}
		}
	};

	xhr.send(JSON.stringify({
		username,
		email,
		password
	}));
}

const form = document.getElementById('signupForm');
form.addEventListener('submit', signup);