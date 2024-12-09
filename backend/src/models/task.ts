import mongoose from 'mongoose';
import removeDiacritics from '../utils/removeDiacritics';
const taskSchema = new mongoose.Schema(
	{
		task: {
			type: String,
			required: true
		},
		normalizedTask: {
			type: String
		}, // Diacritic-free version
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

taskSchema.pre('save', function (next) {
	this.normalizedTask = removeDiacritics(this.task);
	next();
});

type Task = mongoose.InferSchemaType<typeof taskSchema>;
export default mongoose.model<Task>('Task', taskSchema);
