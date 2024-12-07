import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import createHttpError, { isHttpError } from 'http-errors';
import env from './utils/validateEnv';
import MongoStore from 'connect-mongo';
import UserRouter from './routes/users';
import ListRouter from './routes/lists';
import session from 'express-session';
import { requireAuth } from './middlewares/auth';
import { ErrorCode } from './types/ErrorCode';
import cors from 'cors';

const app = express(); // khai báo app

app.use(
	session({
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		rolling: true, // Đặt lại thời gian hết hạn session mỗi khi có hoạt động
		cookie: {
			maxAge: 60 * 60 * 1000, // 1 giờ
			secure: process.env.NODE_ENV === 'production', // HTTPS mới cần
			sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Bảo mật nhưng linh hoạt
			httpOnly: true // Cookie chỉ được backend truy cập
		},
		store: MongoStore.create({
			mongoUrl: env.MONGODB_CONNECTION_STRING
		})
	})
);

const allowedOrigins = [env.FRONTEND_URL];

app.use(
	cors({
		origin: allowedOrigins, // Đảm bảo cho phép origin frontend
		credentials: true // Cho phép cookies được gửi qua CORS
	})
);

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Session (use for login)
// app.use(
// 	session({
// 		secret: env.SESSION_SECRET,
// 		resave: false,
// 		saveUninitialized: false,
// 		cookie: {
// 			maxAge: 60 * 60 * 1000
// 		},
// 		rolling: true,
// 		store: MongoStore.create({
// 			mongoUrl: env.MONGODB_CONNECTION_STRING
// 		})
// 	})
// );

app.get('/', (req, res) => {
	res.json({
		message: 'Hello World'
	});
});

//Routers
app.use('/api/users', UserRouter);
app.use('/api/lists', requireAuth, ListRouter);

//Handle invalid endpoints
app.use((req, res, next) => {
	next(createHttpError(404, 'Endpoint not found'));
});

//Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
	console.error(error);
	let errorMessage = 'An unknown error has occured';
	let status = 500;
	let errorCode = ErrorCode.SERVER_ERROR;

	if (isHttpError(error)) {
		status = error.status;
		errorMessage = error.message;
		errorCode = error.code || ErrorCode.UNKNOWN_ERROR;
	}
	res.status(status).json({ errorMessage, status, errorCode });
});

export default app;
