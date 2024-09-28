import fetchData from './fetchData';
import List from '../models/list';

export async function getLists(): Promise<List[]> {
	const response = await fetchData('/api/lists', { method: 'GET' });
	return response.json();
}

export async function getList(listId: string): Promise<List> {
	const response = await fetchData(`/api/lists/${listId}`, { method: 'GET' });
	return response.json();
}

export interface ListInput {
	name: string;
}

export async function createList(list: ListInput): Promise<List> {
	const response = await fetchData('/api/lists', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(list)
	});
	return response.json();
}

export async function deleteList(listId: string) {
	await fetchData(`/api/lists/${listId}`, { method: 'DELETE' });
}

export async function updateList(
	listId: string,
	list: ListInput
): Promise<List> {
	const response = await fetchData(`/api/lists/${listId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(list)
	});
	return response.json();
}
