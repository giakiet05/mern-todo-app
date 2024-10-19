/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

export const verifyOTP = async (user: any, otp: string) => {
	if (!user.otp)
		throw createHttpError(400, 'This user has not received any OTPs');

	if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
		user.otp = null;
		user.otpExpiresAt = null;
		await user.save();
		throw createHttpError(400, 'OTP has expired. Please request a new one');
	}

	const isOtpMatched = await bcrypt.compare(otp, user.otp);
	if (!isOtpMatched)
		throw createHttpError(400, 'Invalid OTP. Please try again');

	// Clear OTP after successful validation
	user.otp = null;
	user.otpExpiresAt = null;
};
