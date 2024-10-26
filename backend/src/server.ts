import mongoose from 'mongoose';
import app from './app';
import env from './utils/validateEnv';

const port = env.PORT || 5000;

mongoose
	.connect(env.MONGODB_CONNECTION_STRING)
	.then(() => {
		console.log('Connected to Mongoose successfully');
		app.listen(port, () => {
			console.log('Server run on port ' + port);
		});
	})
	.catch(console.error);
export default app;
