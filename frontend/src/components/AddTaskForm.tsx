import { Button, Form, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { TaskInput } from '../network/taskApi';
import * as TaskApi from '../network/taskApi';
import Task from '../models/task';
interface AdddTaskFormProps {
	listId?: string;
	onTaskCreated: (task: Task) => void;
}

export default function AddTaskForm({
	listId,
	onTaskCreated
}: AdddTaskFormProps) {
	const {
		register,
		handleSubmit,
		setFocus,
		setValue,
		formState: { errors, isSubmitting }
	} = useForm<TaskInput>();
	async function onSubmit(input: TaskInput) {
		try {
			const newTask = await TaskApi.createTask(listId!, input);
			onTaskCreated(newTask);
			setValue('task', '');
			setFocus('task');
		} catch (error) {
			alert(error);
		}
	}
	return (
		<Form className="mt-auto mb-4 mx-3" onSubmit={handleSubmit(onSubmit)}>
			<InputGroup className="rounded-pill" style={{ border: '1px solid ' }}>
				<Form.Control
					{...register('task', { required: true })}
					placeholder="Add a new task"
					className="rounded-start-pill"
					isInvalid={!!errors.task}
				/>
				<Button
					type="submit"
					className="button-end rounded-end-pill"
					disabled={isSubmitting}
				>
					Add
				</Button>
			</InputGroup>
		</Form>
	);
}
