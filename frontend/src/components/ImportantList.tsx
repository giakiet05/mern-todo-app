import TaskItem from './TaskItem';

import Task from '../models/task';
import { Stack } from 'react-bootstrap';
interface ImportantListProps {
	tasks: Task[];
	onChecked: (listId: string, taskId: string, checked: boolean) => void;
	onSwitchIsImportant: (
		listId: string,
		taskId: string,
		checked: boolean
	) => void;
	onTaskClicked: (task: Task) => void;
}

export default function ImportantList({
	tasks,
	onChecked,
	onSwitchIsImportant,
	onTaskClicked
}: ImportantListProps) {
	return (
		<div className="d-flex flex-column" style={{ height: '90vh' }}>
			<div className="m-3 d-flex align-items-center">
				<h1>Important</h1>
			</div>

			<Stack className="m-3 overflow-y-auto" gap={3} style={{ height: '67vh' }}>
				{tasks
					?.slice()
					.reverse()
					.map((task) => (
						<TaskItem
							key={task._id}
							task={task}
							onChecked={onChecked}
							onSwitchIsImportant={onSwitchIsImportant}
							onTaskClicked={onTaskClicked}
						/>
					))}
			</Stack>
		</div>
	);
}
