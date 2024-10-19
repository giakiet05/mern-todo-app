import { RequestHandler } from 'express';
import User from '../models/user';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import assertIsDefined from '../utils/assertIsDefined';
import { validateEmail, validatePassword } from '../utils/validators';
import { sendOTPEmail, generateOTP } from '../utils/emailManager';
import { verifyOTP } from '../utils/authUtils';

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
	try {
		const user = await User.findById(req.session.userId);
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

interface SignUpBody {
	username: string;
	email: string;
	password: string;
	passwordConfirmation: string;
}

export const signUp: RequestHandler<
	unknown,
	unknown,
	SignUpBody,
	unknown
> = async (req, res, next) => {
	const {
		username,
		email,
		password: rawPassword,
		passwordConfirmation
	} = req.body;
	try {
		if (!username || !email || !rawPassword || !passwordConfirmation)
			throw createHttpError(400, 'Please fill in all required fields');
		const existingEmail = await User.findOne({ email });
		if (existingEmail)
			throw createHttpError(409, 'This email has already existed');

		if (!validateEmail(email))
			throw createHttpError(400, 'You must enter a valid email');

		if (!validatePassword(rawPassword))
			throw createHttpError(
				400,
				'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
			);

		if (rawPassword !== passwordConfirmation)
			throw createHttpError(
				400,
				'The password and confirmation password do not match'
			);

		const otp = generateOTP();
		const hashedPassword = await bcrypt.hash(rawPassword, 10);
		const hashedOtp = await bcrypt.hash(otp, 10);
		const newUser = await User.create({
			username: username,
			email: email,
			password: hashedPassword,
			otp: hashedOtp,
			otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000)
		});
		await sendOTPEmail(newUser.email, otp);
		res.status(201).json({
			message:
				'Registration successful! Please check your email for the OTP to complete registration'
		});
	} catch (error) {
		next(error);
	}
};

interface VerifyOtpBody {
	email: string;
	otp: string;
}

export const activateUser: RequestHandler<
	unknown,
	unknown,
	VerifyOtpBody,
	unknown
> = async (req, res, next) => {
	const { email, otp } = req.body;

	try {
		if (!email || !otp)
			throw createHttpError(400, 'Please fill in all required fields');
		const user = await User.findOne({ email }).select('+otp +otpExpiresAt');

		if (!user) throw createHttpError(404, 'User not found');

		if (user.isActivated)
			throw createHttpError(409, 'This account is already activated');

		await verifyOTP(user, otp);

		user.isActivated = true;

		await user.save();

		res.status(200).json({ message: 'Account activated successfully!' });
	} catch (error) {
		next(error);
	}
};

export const verifyOtpForResetPassword: RequestHandler<
	unknown,
	unknown,
	VerifyOtpBody,
	unknown
> = async (req, res, next) => {
	const { email, otp } = req.body;
	try {
		if (!email || !otp)
			throw createHttpError(400, 'Please fill in all required fields');
		const user = await User.findOne({ email }).select(
			'+otp +otpExpiresAt +isVerifiedForReset'
		);

		if (!user) throw createHttpError(404, 'User not found');

		await verifyOTP(user, otp);

		user.isVerifiedForReset = true;

		await user.save();

		res.status(200).json({
			message: 'OTP verified successfully. Now you can reset your password'
		});
	} catch (error) {
		next(error);
	}
};

export const sendOtp: RequestHandler = async (req, res, next) => {
	const { email } = req.body;
	try {
		if (!email)
			throw createHttpError(400, 'Please fill in all required fields');

		const user = await User.findOne({ email }).select('+otpExpiresAt');

		if (!user) {
			throw createHttpError(404, 'User not found');
		}

		// Generate a new OTP and update the expiration time
		const otp = generateOTP();
		user.otp = await bcrypt.hash(otp, 10);
		user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

		await user.save();
		await sendOTPEmail(user.email, otp);

		res.status(200).json({ message: 'OTP sent successfully' });
	} catch (error) {
		next(error);
	}
};

interface LogInBody {
	email: string;
	password: string;
}

export const logIn: RequestHandler<
	unknown,
	unknown,
	LogInBody,
	unknown
> = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		if (!email || !password)
			throw createHttpError(400, 'Please fill in all required fields');
		const user = await User.findOne({ email }).select('+password');
		if (!user)
			throw createHttpError(
				404,
				'Incorrect email or password, please try again'
			);

		if (!user.isActivated)
			throw createHttpError(
				400,
				'Your account is not activated. Please check your email to activate your account before logging in'
			);
		const isPasswordMatched = await bcrypt.compare(password, user.password);
		if (!isPasswordMatched)
			throw createHttpError(
				400,
				'Incorrect email or password, please try again'
			);

		req.session.userId = user._id;
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const logOut: RequestHandler = (req, res, next) => {
	req.session.destroy((error) => {
		if (error) next(error);
		else res.sendStatus(200);
	});
};

interface ChangePasswordBody {
	currentPassword: string;
	newPassword: string;
}

export const changePassword: RequestHandler<
	unknown,
	unknown,
	ChangePasswordBody,
	unknown
> = async (req, res, next) => {
	const authenticatedUserId = req.session.userId;
	assertIsDefined(authenticatedUserId);
	const { currentPassword, newPassword } = req.body;

	try {
		if (!currentPassword || !newPassword)
			throw createHttpError(400, 'Please fill in all required fields.');
		const user = await User.findById(authenticatedUserId).select('+password');
		if (!user) throw createHttpError(404, 'User not found');

		const isPasswordMatched = await bcrypt.compare(
			currentPassword,
			user.password
		);

		if (!isPasswordMatched)
			throw createHttpError(400, 'Incorrect current password');

		if (!validatePassword(newPassword))
			throw createHttpError(
				400,
				'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character'
			);

		user.password = await bcrypt.hash(newPassword, 10);
		await user.save();

		res.status(200).json({ message: 'Updated password successfully!' });
	} catch (error) {
		next(error);
	}
};

interface ResetPasswordBody {
	email: string;
	newPassword: string;
}

export const resetPassword: RequestHandler<
	unknown,
	unknown,
	ResetPasswordBody,
	unknown
> = async (req, res, next) => {
	const { email, newPassword } = req.body;
	try {
		if (!email || !newPassword)
			throw createHttpError(400, 'Please fill in all required fields.');
		const user = await User.findOne({ email }).select(
			'+password +isVerifiedForReset'
		);
		if (!user) throw createHttpError(404, 'User not found');
		if (!user.isVerifiedForReset)
			throw createHttpError(
				400,
				'This email is not verified for resetting password'
			);
		if (!validatePassword(newPassword))
			throw createHttpError(
				400,
				'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
			);

		user.password = await bcrypt.hash(newPassword, 10);
		user.isVerifiedForReset = false;
		await user.save();

		res.status(200).json({ message: 'Updated password successfully!' });
	} catch (error) {
		next(error);
	}
};
