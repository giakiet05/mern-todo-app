import { RequestHandler } from 'express';
import Task from '../models/task';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import assertIsDefined from '../utils/assertIsDefined';

interface TaskBody {
	task: string;
	note?: string;
}

interface TaskParams {
	listId: string;
	taskId?: string;
}

export const getTask: RequestHandler = async (req, res, next) => {
	const taskId = req.params.taskId;
	try {
		if (!mongoose.isValidObjectId(taskId))
			throw createHttpError(400, 'Invalid task id');
		const task = await Task.findById(taskId);
		if (!task) throw createHttpError(404, 'Task not found');

		res.status(200).json(task);
	} catch (error) {
		next(error);
	}
};

export const getTasks: RequestHandler = async (req, res, next) => {
	const listId = req.params.listId;
	const authenticatedUserId = req.session.userId;
	try {
		assertIsDefined(authenticatedUserId);
		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');

		const tasks = await Task.find({
			listId: listId,
			userId: authenticatedUserId
		});

		res.status(200).json(tasks);
	} catch (error) {
		next(error);
	}
};

export const searchTasks: RequestHandler = async (req, res, next) => {
	const authenticatedUserId = req.session.userId;
	const searchQuery = req.query.q as string;
	try {
		assertIsDefined(authenticatedUserId);

		if (!searchQuery) {
			return res.status(200).json([]); // Return an empty array if query is empty
		}

		const tasks = await Task.find({
			userId: authenticatedUserId,
			task: { $regex: searchQuery, $options: 'i' } // case-insensitive search
		});

		res.status(200).json(tasks);
	} catch (error) {
		next(error);
	}
};

export const getImportantTasks: RequestHandler = async (req, res, next) => {
	const authenticatedUserId = req.session.userId;
	try {
		assertIsDefined(authenticatedUserId);
		const importantTasks = await Task.find({
			isImportant: true,
			userId: authenticatedUserId
		});
		if (!importantTasks) throw createHttpError(404, 'Task not found');

		res.status(200).json(importantTasks);
	} catch (error) {
		next(error);
	}
};

export const createTask: RequestHandler<
	TaskParams,
	unknown,
	TaskBody,
	unknown
> = async (req, res, next) => {
	const { task, note } = req.body;
	const listId = req.params.listId;
	const authenticatedUserId = req.session.userId;
	try {
		assertIsDefined(authenticatedUserId);
		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');
		if (!task) throw createHttpError(400, 'Task should not be empty');
		const newTask = await Task.create({
			listId: listId,
			userId: authenticatedUserId,
			task: task,
			note: note,
			isImportant: false,
			checked: false
		});

		res.status(201).json(newTask);
	} catch (error) {
		next(error);
	}
};

export const updateTask: RequestHandler<
	TaskParams,
	unknown,
	TaskBody,
	unknown
> = async (req, res, next) => {
	const taskId = req.params.taskId;
	const listId = req.params.listId;
	const newTask = req.body.task;
	const newNote = req.body.note;
	try {
		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');
		if (!mongoose.isValidObjectId(taskId))
			throw createHttpError(400, 'Invalid task id');
		if (!newTask) throw createHttpError(400, 'A task must have a title');

		const task = await Task.findById(taskId);

		if (!task) throw createHttpError(404, 'Task not found');
		if (!task.listId.equals(listId))
			throw createHttpError(401, 'You cannot access this list');

		task.task = newTask;
		task.note = newNote;

		const updatedTask = await task.save();
		res.status(200).json(updatedTask);
	} catch (error) {
		next(error);
	}
};

export const checkTask: RequestHandler<
	TaskParams,
	unknown,
	{ checked: boolean },
	unknown
> = async (req, res, next) => {
	const taskId = req.params.taskId;
	const listId = req.params.listId;
	const checked = req.body.checked;
	try {
		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');
		if (!mongoose.isValidObjectId(taskId))
			throw createHttpError(400, 'Invalid task id');

		const task = await Task.findById(taskId);

		if (!task) throw createHttpError(404, 'Task not found');
		if (!task.listId.equals(listId))
			throw createHttpError(401, 'You cannot access this list');

		task.checked = checked;
		task.completedAt = checked ? new Date() : undefined;

		const updatedTask = await task.save();
		res.status(200).json(updatedTask);
	} catch (error) {
		next(error);
	}
};

export const toggleImportantTask: RequestHandler<
	TaskParams,
	unknown,
	{ isImportant: boolean },
	unknown
> = async (req, res, next) => {
	const taskId = req.params.taskId;
	const listId = req.params.listId;
	const isImportant = req.body.isImportant;
	try {
		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');
		if (!mongoose.isValidObjectId(taskId))
			throw createHttpError(400, 'Invalid task id');

		const task = await Task.findById(taskId);

		if (!task) throw createHttpError(404, 'Task not found');
		if (!task.listId.equals(listId))
			throw createHttpError(401, 'You cannot access this list');

		task.isImportant = isImportant;

		const updatedTask = await task.save();
		res.status(200).json(updatedTask);
	} catch (error) {
		next(error);
	}
};

export const deleteTask: RequestHandler = async (req, res, next) => {
	const taskId = req.params.taskId;
	const listId = req.params.listId;

	try {
		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');
		if (!mongoose.isValidObjectId(taskId))
			throw createHttpError(400, 'Invalid task id');

		// Find and delete the task in one query
		const task = await Task.findOneAndDelete({ _id: taskId, listId: listId });

		if (!task) {
			throw createHttpError(
				404,
				'Task not found or does not belong to this list'
			);
		}

		if (!task.listId.equals(listId))
			throw createHttpError(401, 'You cannot access this list');

		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};

export const deleteAllTasksWithList: RequestHandler = async (
	req,
	res,
	next
) => {
	const listId = req.params.listId;

	try {
		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');

		await Task.deleteMany({ listId: listId });
		next();
	} catch (error) {
		next(error);
	}
};

export const deleteAllTasks: RequestHandler = async (req, res, next) => {
	const listId = req.params.listId;

	try {
		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');

		await Task.deleteMany({ listId: listId });
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};

export const checkAllTasks: RequestHandler = async (req, res, next) => {
	const listId = req.params.listId;

	try {
		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');

		const tasks = await Task.find({ listId });
		if (!tasks) throw createHttpError(404, 'Tasks not found');
		const isAllChecked = tasks.every((task) => task.checked === true);
		const newCheckedStatus = !isAllChecked;

		if (newCheckedStatus) {
			// Set checked to true and completedAt to current date
			await Task.updateMany(
				{ listId },
				{ $set: { checked: true, completedAt: new Date() } }
			);
		} else {
			// Set checked to false and remove completedAt field
			await Task.updateMany(
				{ listId },
				{ $set: { checked: false }, $unset: { completedAt: '' } }
			);
		}

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
};
