import { Button, Form, Modal } from 'react-bootstrap';
import TextInputField from './form/TextInputField';
import { useForm } from 'react-hook-form';
import * as UserApi from '../network/userApi';
import { ChangePasswordCredentials } from '../network/userApi';

import { useEffect } from 'react';
interface ChangePasswordModalProps {
	onDismiss: () => void;
	onChangedPasswordSuccessfully: () => void;
}

export default function ChangePasswordModal({
	onDismiss,
	onChangedPasswordSuccessfully: onChangedPasswordSuccessfully
}: ChangePasswordModalProps) {
	const {
		register,
		handleSubmit,
		setFocus,
		formState: { errors, isSubmitting }
	} = useForm<ChangePasswordCredentials>();

	async function onSubmit(credentials: ChangePasswordCredentials) {
		try {
			await UserApi.changePassword(credentials);
			onChangedPasswordSuccessfully();
		} catch (error) {
			alert(error);
			console.log(error);
		}
	}

	useEffect(() => {
		setFocus('currentPassword');
	}, [setFocus]);

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Change password</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						name="currentPassword"
						label="Current password"
						type="password"
						placeholder="Current password"
						register={register}
						registerOptions={{ required: 'Required' }}
						error={errors.currentPassword}
					/>

					<TextInputField
						name="newPassword"
						label="New password"
						type="password"
						placeholder="New password"
						register={register}
						registerOptions={{ required: 'Required' }}
						error={errors.newPassword}
					/>
					<Button type="submit" className="w-100" disabled={isSubmitting}>
						Save
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
