import { CustomError } from '../types/CustomError';

export default async function fetchData(
	input: RequestInfo,
	init?: RequestInit
) {
	const baseUrl: string = 'https://mern-todo-app-backend-ta4u.onrender.com'; // Lấy giá trị từ biến môi trường
	console.log(baseUrl);
	if (!baseUrl) {
		throw new Error(
			'API key (VITE_API_KEY) is not defined in environment variables.'
		);
	}

	const response = await fetch(baseUrl + input, init);

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
