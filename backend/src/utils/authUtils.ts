/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { ErrorCode } from '../types/ErrorCode';

export const verifyOTP = async (user: any, otp: string) => {
	if (!user.otp) {
		throw createHttpError(400, {
			message: 'This user has not received any OTPs',
			code: ErrorCode.OTP_NOT_RECEIVED // Use an appropriate error code from your enum
		});
	}

	if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
		user.otp = null;
		user.otpExpiresAt = null;
		await user.save();
		throw createHttpError(400, {
			message: 'OTP has expired. Please request a new one',
			code: ErrorCode.OTP_EXPIRED // Use the OTP_EXPIRED error code
		});
	}

	const isOtpMatched = await bcrypt.compare(otp, user.otp);
	if (!isOtpMatched) {
		throw createHttpError(400, {
			message: 'Invalid OTP. Please try again',
			code: ErrorCode.OTP_INCORRECT // Use the OTP_INCORRECT error code
		});
	}

	// Clear OTP after successful validation
	user.otp = null;
	user.otpExpiresAt = null;
};
