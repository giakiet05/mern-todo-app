import { RequestHandler } from 'express';
import List from '../models/list';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';

export const getLists: RequestHandler = async (req, res, next) => {
	const authenticatedUserId = req.session.userId;
	try {
		const lists = await List.find({ userId: authenticatedUserId });
		res.status(200).json(lists);
	} catch (error) {
		next(error);
	}
};

export const getList: RequestHandler = async (req, res, next) => {
	const listId = req.params.listId;
	const authenticatedUserId = req.session.userId;
	try {
		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');

		const list = await List.findById(listId);
		if (!list) throw createHttpError(404, 'List not found');
		if (!list.userId.equals(authenticatedUserId))
			throw createHttpError(401, 'You cannot access this list');

		res.status(200).json(list);
	} catch (error) {
		next(error);
	}
};

interface ListBody {
	name: string;
}

export const createList: RequestHandler<
	unknown,
	unknown,
	ListBody,
	unknown
> = async (req, res, next) => {
	const name = req.body.name;
	const authenticatedUserId = req.session.userId;
	try {
		if (!name) throw createHttpError(400, 'A list must have a name');
		const newList = await List.create({
			userId: authenticatedUserId,
			name: name
		});
		res.status(201).json(newList);
	} catch (error) {
		next(error);
	}
};

interface UpdateListParams {
	listId: string;
}

export const updateList: RequestHandler<
	UpdateListParams,
	unknown,
	ListBody,
	unknown
> = async (req, res, next) => {
	const newName = req.body.name;
	const listId = req.params.listId;
	const authenticatedUserId = req.session.userId;
	try {
		if (!newName) throw createHttpError(400, 'List name is required');

		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');

		const list = await List.findById(listId);
		if (!list) throw createHttpError(404, 'List not found');
		if (!list.userId.equals(authenticatedUserId))
			throw createHttpError(401, 'You cannot access this list');

		list.name = newName;
		const updatedList = await list.save();
		res.status(200).json(updatedList);
	} catch (error) {
		next(error);
	}
};

export const deleteList: RequestHandler = async (req, res, next) => {
	const listId = req.params.listId;
	const authenticatedUserId = req.session.userId;
	try {
		if (!mongoose.isValidObjectId(listId))
			throw createHttpError(400, 'Invalid list id');

		const list = await List.findOneAndDelete({
			_id: listId,
			userId: authenticatedUserId
		});
		if (!list) throw createHttpError(404, 'List not found');

		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};
