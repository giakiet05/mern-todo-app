import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
	{
		task: {
			type: String,
			required: true
		},
		note: {
			type: String
		},
		listId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'List',
			required: true
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		checked: {
			type: Boolean,
			required: true,
			default: false
		},
		isImportant: {
			type: Boolean,
			default: false,
			required: true
		},
		completedAt: {
			type: Date
		}
	},
	{ timestamps: true }
);

type Task = mongoose.InferSchemaType<typeof taskSchema>;
export default mongoose.model<Task>('Task', taskSchema);
