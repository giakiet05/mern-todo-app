import { FaTimes, FaRegStar, FaTrash, FaStar } from 'react-icons/fa';
import { Button, Form } from 'react-bootstrap';
import TextInputField from './form/TextInputField';
import { useForm } from 'react-hook-form';
import Task from '../models/task';
import { TaskInput } from '../network/taskApi';
import { useEffect } from 'react';
import * as TaskApi from '../network/taskApi';
interface EditTaskSideBarProps {
	task: Task;
	onTaskSaved: (task: Task) => void;
	onDismiss: () => void;
	onDeleteTaskBtnClicked: (listId: string, taskId: string) => void;
	onSwitchIsImportant: (
		listId: string,
		taskId: string,
		checked: boolean
	) => void;
}

export default function EditTaskSideBar({
	task,
	onTaskSaved,
	onDismiss,
	onSwitchIsImportant,
	onDeleteTaskBtnClicked
}: EditTaskSideBarProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting }
	} = useForm<TaskInput>();

	useEffect(() => {
		reset({
			task: task.task || '',
			note: task.note || ''
		});
	}, [task, reset]);

	async function onSubmit(input: TaskInput) {
		try {
			const updatedTask = await TaskApi.updateTask(
				task.listId,
				task._id,
				input
			);
			onTaskSaved(updatedTask);
		} catch (error) {
			alert(error);
		}
	}

	const createdTimeText = `Created at: ${new Date(
		task.createdAt
	).toLocaleString('en-GB')}`;
	const completedTimeText =
		task.checked && task.completedAt
			? `Completed at: ${new Date(task.completedAt).toLocaleString('en-GB')}`
			: '';
	return (
		<div
			style={{
				height: '92vh',
				minWidth: '400px',
				borderLeft: '1px solid #333',
				position: 'relative',
				padding: '0 16px'
			}}
		>
			<div className="d-flex align-items-center justify-content-between">
				<div className="mt-3 d-flex align-items-center position-relative">
					<h3 className="me-2">Edit task</h3>
					<div
						style={{ position: 'absolute', top: 3, right: -20 }}
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
				</div>
				<FaTimes size={25} onClick={onDismiss} style={{ cursor: 'pointer' }} />
			</div>

			<p className="m-0 text-muted fst-italic">{createdTimeText}</p>
			{task.completedAt && (
				<p className="m-0 text-muted fst-italic">{completedTimeText}</p>
			)}

			<Form
				className="mt-3"
				onSubmit={handleSubmit(onSubmit)}
				id="editTaskForm"
			>
				<TextInputField
					name="task"
					label="Task"
					type="text"
					as="textarea"
					rows={3}
					placeholder="Add task"
					register={register}
					registerOptions={{
						required: 'A task must have a title'
					}}
					error={errors.task}
				/>
				<TextInputField
					name="note"
					label="Note"
					type="text"
					placeholder="Add note"
					register={register}
					as="textarea"
					rows={10}
					error={errors.note}
				/>
			</Form>

			<div
				className="mx-3 d-flex justify-content-between align-items-center"
				style={{
					position: 'absolute',
					bottom: '24px', // Adjust the bottom spacing
					left: '0',
					right: '0'
					// Adds padding on left and right
				}}
			>
				<Button
					variant="danger"
					onClick={() => onDeleteTaskBtnClicked(task.listId, task._id)}
				>
					<FaTrash />
				</Button>
				<Button
					form="editTaskForm"
					type="submit"
					variant="primary"
					disabled={isSubmitting}
				>
					Save
				</Button>
			</div>
		</div>
	);
}
