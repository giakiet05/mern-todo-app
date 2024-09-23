import { Card } from 'react-bootstrap';
import style from '../styles/Task.module.css';
import { FaRegStar, FaStar } from 'react-icons/fa';
import Task from '../models/task';
import { FaRegNoteSticky } from 'react-icons/fa6';
interface TaskItemProps {
	task: Task;
	onChecked: (listId: string, taskId: string, checked: boolean) => void;
	onSwitchIsImportant: (
		listId: string,
		taskId: string,
		checked: boolean
	) => void;
	onTaskClicked: (task: Task) => void;
}

export default function TaskItem({
	task,
	onChecked,
	onSwitchIsImportant,
	onTaskClicked
}: TaskItemProps) {
	return (
		<Card className={style.task}>
			<Card.Body
				className="d-flex align-items-center"
				onClick={(e) => {
					if (e.currentTarget !== e.target) {
						return; // stop propagation from parent element to its children
					}
					onTaskClicked(task);
				}}
			>
				<input
					checked={task.checked}
					id={task._id}
					type="checkbox"
					className="me-2 "
					style={{ width: 18, height: 18 }}
					onChange={() => {
						onChecked(task.listId, task._id, !task.checked);
					}}
				/>
				<label className="d-flex align-items-center" htmlFor={task._id}>
					{task.task}
					{task.note ? <FaRegNoteSticky size={12} className="ms-2" /> : ''}
				</label>

				<div
					className="ms-auto"
					onClick={() => {
						onSwitchIsImportant(task.listId, task._id, !task.isImportant);
					}}
				>
					{task.isImportant ? (
						<FaStar size={20} color="#fcc603" />
					) : (
						<FaRegStar size={20} />
					)}
				</div>
			</Card.Body>
		</Card>
	);
}
