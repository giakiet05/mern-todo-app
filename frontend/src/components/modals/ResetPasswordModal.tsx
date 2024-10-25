import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import TextInputField from '../form/TextInputField';
import { useEffect } from 'react';
import * as UserApi from '../../network/userApi';
import { CustomError } from '../../types/CustomError';
interface ResetPasswordModalProps {
	onDismiss: () => void;
	email: string;
	onPasswordReset: () => void;
	errorMessage: string;
	setErrorMessage: (message: string) => void;
}

export default function ResetPasswordModal({
	onDismiss,
	email,
	errorMessage,
	setErrorMessage,
	onPasswordReset
}: ResetPasswordModalProps) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
		setFocus
	} = useForm<FormBody>();

	interface FormBody {
		password: string;
		passwordConfirmation: string;
	}

	async function onSubmit(input: FormBody) {
		const credentials = {
			email: email,
			newPassword: input.password,
			passwordConfirmation: input.passwordConfirmation
		};

		try {
			await UserApi.resetPassword(credentials);
			onPasswordReset();
		} catch (error) {
			const customError = error as CustomError;
			setErrorMessage(customError.errorMessage);
		}
	}
	const password = watch('password');
	useEffect(() => {
		setFocus('password');
	}, [setFocus]);

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Reset password</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorMessage && (
					<div className="w-100 text-danger mb-3">{errorMessage}</div>
				)}
				<Form noValidate onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						type="password"
						name="password"
						label="Enter your new password"
						register={register}
						registerOptions={{
							required: 'You need to enter your new password'
						}}
						error={errors.password}
						placeholder="Your new password"
					/>
					<TextInputField
						name="passwordConfirmation"
						label="Password confirmation"
						type="password"
						placeholder="Re-enter your password"
						register={register}
						registerOptions={{
							required: 'A password confirmation is required',
							validate: (value) =>
								value === password ||
								'Password and password confirmation do not match'
						}}
						error={errors.passwordConfirmation}
					/>
					<Button className="w-100" type="submit" disabled={isSubmitting}>
						Submit
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
