import fetchData from './fetchData';
import User from '../models/user';

export async function getLoggedInUser(): Promise<User> {
	const response = await fetchData('/api/users', { method: 'GET' });
	return response.json();
}

export interface SignUpCredentials {
	username: string;
	email: string;
	password: string;
	passwordConfirmation: string;
}

export async function checkExistingUser(email: string) {
	const response = await fetchData('/api/users/check-existing-user', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email })
	});
	if (response.status === 200) return true;
	return false;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
	const response = await fetchData('/api/users/signup', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	});
	return response.json();
}

export interface LogInCredentials {
	email: string;
	password: string;
}

export async function logIn(credentials: LogInCredentials): Promise<User> {
	const response = await fetchData('/api/users/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	});
	return response.json();
}

export async function logOut() {
	await fetchData('/api/users/logout', { method: 'POST' });
}

export interface ChangePasswordCredentials {
	currentPassword: string;
	newPassword: string;
	passwordConfirmation: string;
}

export async function changePassword(credentials: ChangePasswordCredentials) {
	const response = await fetchData('/api/users/change-password', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	});
	return response.json();
}

export interface ResestPasswordBody {
	email: string;
	newPassword: string;
	passwordConfirmation: string;
}

export async function resetPassword(credentials: ResestPasswordBody) {
	const response = await fetchData('/api/users/reset-password', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	});
	return response.json();
}

export interface VerifyOtpBody {
	email: string;
	otp: string;
}

export async function activateUser(credentials: VerifyOtpBody) {
	const response = await fetchData('/api/users/activate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	});

	return response.json();
}

export async function verifyOtpForResetPassword(credentials: VerifyOtpBody) {
	const response = await fetchData('/api/users/verify-otp-for-reset-password', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	});

	return response.json();
}

export async function sendOtp(email: string) {
	const response = await fetchData('/api/users/send-otp', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email })
	});

	return response.json();
}
