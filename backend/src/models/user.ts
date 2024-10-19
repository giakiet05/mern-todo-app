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
		unique: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	isActivated: {
		type: Boolean,
		default: false
	},
	otp: {
		type: String,
		select: false
	},
	otpExpiresAt: {
		type: Date,
		select: false
	},
	isVerifiedForReset: {
		type: Boolean,
		default: false,
		select: false
	}
});

type User = mongoose.InferSchemaType<typeof userSchema>;
export default mongoose.model<User>('User', userSchema);
