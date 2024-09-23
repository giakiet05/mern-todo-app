import fetchData from './fetchData';
import Task from '../models/task';

export async function getTask(listId: string, taskId: string): Promise<Task> {
	const response = await fetchData(`/api/lists/${listId}/tasks/${taskId}`, {
		method: 'GET'
	});
	if (!response.ok) {
		throw new Error(`Error fetching task: ${response.statusText}`);
	}
	return response.json();
}

export async function getTasks(listId: string): Promise<Task[]> {
	const response = await fetchData(`/api/lists/${listId}/tasks`, {
		method: 'GET'
	});
	if (!response.ok) {
		throw new Error(`Error fetching tasks: ${response.statusText}`);
	}
	return response.json();
}

export async function getImportantTasks(): Promise<Task[]> {
	const response = await fetchData(`/api/lists/important`, {
		method: 'GET'
	});
	if (!response.ok) {
		throw new Error(`Error fetching important tasks: ${response.statusText}`);
	}
	return response.json();
}

export async function searchTasks(query: string): Promise<Task[]> {
	const response = await fetchData(
		`/api/lists/search?q=${encodeURIComponent(query)}`,
		{ method: 'GET' }
	);
	return response.json();
}

export interface TaskInput {
	task: string; // Made required for clarity
	note?: string;
	isImportant?: boolean;
}

export async function createTask(
	listId: string,
	task: TaskInput
): Promise<Task> {
	const response = await fetchData(`/api/lists/${listId}/tasks`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(task)
	});
	if (!response.ok) {
		throw new Error(`Error creating task: ${response.statusText}`);
	}
	return response.json();
}

export async function deleteTask(
	listId: string,
	taskId: string
): Promise<void> {
	const response = await fetchData(`/api/lists/${listId}/tasks/${taskId}`, {
		method: 'DELETE'
	});
	if (!response.ok) {
		throw new Error(`Error deleting task: ${response.statusText}`);
	}
}

export async function updateTask(
	listId: string,
	taskId: string,
	task: TaskInput
): Promise<Task> {
	const response = await fetchData(`/api/lists/${listId}/tasks/${taskId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(task)
	});
	if (!response.ok) {
		throw new Error(`Error updating task: ${response.statusText}`);
	}
	return response.json();
}

export async function checkTask(
	listId: string,
	taskId: string,
	checked: boolean
): Promise<Task> {
	const response = await fetchData(
		`/api/lists/${listId}/tasks/${taskId}/checked`,
		{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ checked })
		}
	);
	if (!response.ok) {
		throw new Error(`Error checking task: ${response.statusText}`);
	}
	return response.json();
}

export async function updateImportantTask(
	listId: string,
	taskId: string,
	isImportant: boolean
): Promise<Task> {
	const response = await fetchData(
		`/api/lists/${listId}/tasks/${taskId}/important`,
		{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ isImportant })
		}
	);
	if (!response.ok) {
		throw new Error(`Error updating important task: ${response.statusText}`);
	}
	return response.json();
}

export async function checkAllTasks(listId: string): Promise<void> {
	const response = await fetchData(`/api/lists/${listId}/tasks/checkall`, {
		method: 'PATCH'
	});
	if (!response.ok) {
		throw new Error(`Error checking all tasks: ${response.statusText}`);
	}
}

export async function deleteAllTasks(listId: string): Promise<void> {
	const response = await fetchData(`/api/lists/${listId}/tasks/deleteall`, {
		method: 'DELETE'
	});
	if (!response.ok) {
		throw new Error(`Error deleting all tasks: ${response.statusText}`);
	}
}
