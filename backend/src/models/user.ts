import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		select: false,
		unique: true
	},
	password: {
		type: String,
		required: true,
		select: false
	}
});

type User = mongoose.InferSchemaType<typeof userSchema>;
export default mongoose.model<User>('User', userSchema);
