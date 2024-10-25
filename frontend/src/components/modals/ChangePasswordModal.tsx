import { Button, Form, Modal } from 'react-bootstrap';
import TextInputField from '../form/TextInputField';
import { useForm } from 'react-hook-form';
import * as UserApi from '../../network/userApi';
import { ChangePasswordCredentials } from '../../network/userApi';
import { useEffect } from 'react';
import { CustomError } from '../../types/CustomError';
interface ChangePasswordModalProps {
	onDismiss: () => void;
	errorMessage: string;
	onChangedPasswordSuccessfully: () => void;
	setErrorMessage: (message: string) => void;
}

export default function ChangePasswordModal({
	onDismiss,
	onChangedPasswordSuccessfully,
	errorMessage,
	setErrorMessage
}: ChangePasswordModalProps) {
	const {
		register,
		handleSubmit,
		setFocus,
		watch,
		formState: { errors, isSubmitting }
	} = useForm<ChangePasswordCredentials>();

	async function onSubmit(credentials: ChangePasswordCredentials) {
		try {
			await UserApi.changePassword(credentials);
			onChangedPasswordSuccessfully();
		} catch (error) {
			const customError = error as CustomError;
			setErrorMessage(customError.errorMessage);
		}
	}
	const newPassword = watch('newPassword');
	useEffect(() => {
		setFocus('currentPassword');
	}, [setFocus]);

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Change password</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorMessage && (
					<div className="w-100 text-danger mb-3">{errorMessage}</div>
				)}
				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						name="currentPassword"
						label="Current password"
						type="password"
						placeholder="Your password"
						register={register}
						registerOptions={{
							required: 'You need to enter your current password'
						}}
						error={errors.currentPassword}
					/>

					<TextInputField
						name="newPassword"
						label="New password"
						type="password"
						placeholder="Your new password"
						register={register}
						registerOptions={{
							required: 'You need to enter your new password'
						}}
						error={errors.newPassword}
					/>
					<TextInputField
						name="passwordConfirmation"
						label="New password confirmation"
						type="password"
						placeholder="Re-enter your new password"
						register={register}
						registerOptions={{
							required: 'A password confirmation is required',
							validate: (value) =>
								value === newPassword ||
								'Password and password confirmation do not match'
						}}
						error={errors.passwordConfirmation}
					/>
					<Button type="submit" className="w-100" disabled={isSubmitting}>
						Save
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
