export default async function fetchData(
	input: RequestInfo,
	init?: RequestInit
) {
	const response = await fetch(input, init);
	if (response.ok) return response;
	else {
		const errorBody = await response.json();
		const errorMessage = errorBody.error;
		throw new Error(
			`Request failed with status: ${response.status}, message: ${errorMessage}`
		);
	}
}
