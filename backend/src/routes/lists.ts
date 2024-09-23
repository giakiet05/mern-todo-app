import express from 'express';
import * as ListController from '../controllers/lists';
import * as TaskController from '../controllers/tasks';
import { requireAuth } from '../middlewares/auth';

const router = express.Router();

// GET Routes
router.get('/', requireAuth, ListController.getLists); // Get all lists
router.get('/important', TaskController.getImportantTasks); // Get important tasks
router.get('/search', TaskController.searchTasks); //search tasks
router.get('/:listId', ListController.getList); // Get a list by ID
router.get('/:listId/tasks', TaskController.getTasks); // Get tasks of a list
router.get('/:listId/tasks/:taskId', TaskController.getTask); // Get a single task by ID
// POST Routes
router.post('/', ListController.createList); // Create a new list
router.post('/:listId/tasks', TaskController.createTask); // Create a new task in a list

// PATCH Routes
router.patch('/:listId', ListController.updateList); // Update a list by ID
router.patch('/:listId/tasks/checkall', TaskController.checkAllTasks); // Check all tasks in a list
router.patch('/:listId/tasks/:taskId', TaskController.updateTask); // Update a task (title and note)
router.patch('/:listId/tasks/:taskId/checked', TaskController.checkTask); // Check a task by ID
router.patch(
	'/:listId/tasks/:taskId/important',
	TaskController.toggleImportantTask
); // Mark a task as important

// DELETE Routes
router.delete(
	'/:listId',
	TaskController.deleteAllTasksWithList,
	ListController.deleteList
); // Delete a list and its tasks
router.delete('/:listId/tasks/deleteall', TaskController.deleteAllTasks); // Delete all tasks in a list
router.delete('/:listId/tasks/:taskId', TaskController.deleteTask); // Delete a task by ID

export default router;
