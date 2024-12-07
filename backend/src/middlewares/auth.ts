import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const requireAuth: RequestHandler = async (req, res, next) => {
	console.log(req.session.userId + ' là thằng đang đăng nhập');
	if (req.session.userId) next();
	else next(createHttpError(401, 'User is not authenticated'));
};
