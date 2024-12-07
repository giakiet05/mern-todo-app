import { CustomError } from '../types/CustomError';

export default async function fetchData(
	input: RequestInfo,
	init?: RequestInit
) {
	const baseUrl: string =
		import.meta.env.VITE_API_URL || 'http://localhost:5000';
	console.log(baseUrl);
	if (!baseUrl) {
		throw new Error(
			'API url (VITE_API_URL) is not defined in environment variables.'
		);
	}

	// Thêm credentials: 'include' vào `init` để gửi cookie
	const fetchInit: RequestInit = {
		...init, // Giữ lại các thuộc tính khác của `init`
		credentials: 'include' // Gửi cookies (session cookies)
	};

	const response = await fetch(baseUrl + input, fetchInit);

	if (response.ok) {
		return response;
	} else {
		const errorBody = await response.json();
		const errorMessage = errorBody.errorMessage || 'An error occurred';
		const errorCode = errorBody.errorCode || 'UNKNOWN_ERROR';

		// Throw a CustomError instead of a generic Error
		throw new CustomError(response.status, errorCode, errorMessage);
	}
}
