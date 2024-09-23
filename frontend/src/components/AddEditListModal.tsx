import { Button, Form, Modal } from 'react-bootstrap';
import List from '../models/list';
import { useForm } from 'react-hook-form';
import { ListInput } from '../network/listApi';
import * as ListApi from '../network/listApi';
import TextInputField from './form/TextInputField';
interface AddEditListModalProps {
	onDismiss: () => void;
	onListSaved: (list: List) => void;
	listToEdit?: List;
}

export default function AddEditListModal({
	onDismiss,
	onListSaved,
	listToEdit
}: AddEditListModalProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<ListInput>({
		defaultValues: {
			name: listToEdit?.name || ''
		}
	});

	async function onSubmit(input: ListInput) {
		let list: List;

		try {
			if (listToEdit) list = await ListApi.updateList(listToEdit._id, input);
			else list = await ListApi.createList(input);
			onListSaved(list);
		} catch (error) {
			alert(error);
		}
	}

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>{listToEdit ? 'Edit List' : 'Add list'}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						type="text"
						name="name"
						label="Name"
						register={register}
						registerOptions={{
							required: 'A list must have a name'
						}}
						error={errors.name}
						placeholder="Add list name"
					/>
					<Button className="w-100" type="submit" disabled={isSubmitting}>
						{listToEdit ? 'Save' : 'Add'}
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
