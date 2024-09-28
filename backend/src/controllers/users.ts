import { RequestHandler } from 'express';
import User from '../models/user';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
	try {
		const user = await User.findById(req.session.userId).select('+email');
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

interface SignUpBody {
	username: string;
	email: string;
	password: string;
}

export const signUp: RequestHandler<
	unknown,
	unknown,
	SignUpBody,
	unknown
> = async (req, res, next) => {
	const { username, email, password: rawPassword } = req.body;
	try {
		if (!username || !email || !rawPassword)
			throw createHttpError(401, 'Please fill in all required fields');
		const existingUsername = await User.findOne({ username: username });
		if (existingUsername)
			throw createHttpError(409, 'This username has already existed');
		const existingEmail = await User.findOne({ email: email });
		if (existingEmail)
			throw createHttpError(409, 'This email has already existed');

		const hashedPassword = await bcrypt.hash(rawPassword, 10);

		const newUser = await User.create({
			username: username,
			email: email,
			password: hashedPassword
		});

		req.session.userId = newUser._id;
		res.status(201).json(newUser);
	} catch (error) {
		next(error);
	}
};

interface LogInBody {
	username: string;
	password: string;
}

export const logIn: RequestHandler<
	unknown,
	unknown,
	LogInBody,
	unknown
> = async (req, res, next) => {
	const { username, password } = req.body;
	try {
		if (!username || !password)
			throw createHttpError(400, 'Please fill in all required fields.');
		const user = await User.findOne({ username: username }).select(
			'+email +password'
		);
		if (!user)
			throw createHttpError(
				404,
				'Incorrect username or password, please try again'
			);
		const isPasswordMatched = await bcrypt.compare(password, user.password);
		if (!isPasswordMatched)
			throw createHttpError(
				400,
				'Incorrect username or password, please try again'
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
