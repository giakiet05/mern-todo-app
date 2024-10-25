import { Button, Form, Modal } from 'react-bootstrap';
import TextInputField from '../form/TextInputField';
import { useForm } from 'react-hook-form';
import { SignUpCredentials } from '../../network/userApi';
import User from '../../models/user';
import * as UserApi from '../../network/userApi';
import { useEffect } from 'react';
import { CustomError } from '../../types/CustomError';

interface SignUpModalProps {
	onDismiss: () => void;
	onSignedUpSuccessfully: (user: User) => void;
	errorMessage: string;
	setErrorMessage: (message: string) => void;
}

export default function SignUpModal({
	onDismiss,
	onSignedUpSuccessfully,
	errorMessage,
	setErrorMessage
}: SignUpModalProps) {
	const {
		register,
		handleSubmit,
		setFocus,
		watch,
		formState: { errors, isSubmitting }
	} = useForm<SignUpCredentials>();

	async function onSubmit(credentials: SignUpCredentials) {
		try {
			const newUser = await UserApi.signUp(credentials);
			onSignedUpSuccessfully(newUser);
		} catch (error) {
			const customError = error as CustomError;
			setErrorMessage(customError.errorMessage);
		}
	}
	useEffect(() => {
		setFocus('username');
		setErrorMessage('');
	}, [setFocus, setErrorMessage]);

	const password = watch('password'); // Watch the password field value

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Sign up</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorMessage && (
					<div className="w-100 text-danger mb-3">{errorMessage}</div>
				)}
				<Form noValidate onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						name="username"
						label="Username"
						type="text"
						placeholder="e.g: John Doe"
						register={register}
						registerOptions={{ required: 'A username is required' }}
						error={errors.username}
					/>

					<TextInputField
						name="email"
						label="Email"
						type="email"
						placeholder="e.g: johndoe123@gmail.com"
						register={register}
						registerOptions={{
							required: 'An email is required',
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
								message: 'A valid email address is required'
							}
						}}
						error={errors.email}
					/>

					<TextInputField
						name="password"
						label="Password"
						type="password"
						placeholder="Your password"
						register={register}
						registerOptions={{
							required: 'A password is required',
							pattern: {
								value:
									/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
								message:
									'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
							}
						}}
						error={errors.password}
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

					<Button type="submit" className="w-100" disabled={isSubmitting}>
						Sign up
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
