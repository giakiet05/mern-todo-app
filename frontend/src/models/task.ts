export default interface Task {
	_id: string;
	task: string;
	note?: string;
	listId: string;
	userId: string;
	checked: boolean;
	isImportant: boolean;
	createdAt: string;
	updatedAt: string;
	completedAt?: string;
}
