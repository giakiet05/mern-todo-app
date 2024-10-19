export function validatePassword(password: string) {
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	const valid = passwordRegex.test(password);

	return valid;
}

export function validateEmail(email: string) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const valid = emailRegex.test(email);
	return valid;
}
