import { CustomError } from '../types/CustomError';

export default async function fetchData(
	input: RequestInfo,
	init?: RequestInit
) {
	const response = await fetch(input, init);

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
