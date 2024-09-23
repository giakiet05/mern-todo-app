import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

type List = mongoose.InferSchemaType<typeof listSchema>;
export default mongoose.model<List>('List', listSchema);
