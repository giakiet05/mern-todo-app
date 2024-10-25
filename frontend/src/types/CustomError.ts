// src/types/CustomError.ts
export class CustomError extends Error {
	status: number;
	errorCode: string;
	errorMessage: string;

	constructor(status: number, errorCode: string, errorMessage: string) {
		super(`Request failed with status: ${status}`);
		this.status = status;
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}
}
