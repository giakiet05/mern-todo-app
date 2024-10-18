import { Button, Form, Modal } from 'react-bootstrap';
import TextInputField from './form/TextInputField';
import { useForm } from 'react-hook-form';
import * as UserApi from '../network/userApi';
import { LogInCredentials } from '../network/userApi';
import User from '../models/user';
import { useEffect } from 'react';
interface LogInModalProps {
	onDismiss: () => void;
	onLoggedInSuccessfully: (user: User) => void;
	errorMessage: string;
	setErrorMessage: (message: string) => void;
	extractErrorMessage: (error: Error) => string;
}

export default function LogInModal({
	onDismiss,
	onLoggedInSuccessfully,
	errorMessage,
	setErrorMessage,
	extractErrorMessage
}: LogInModalProps) {
	const {
		register,
		handleSubmit,
		setFocus,
		setValue,
		formState: { errors, isSubmitting }
	} = useForm<LogInCredentials>();

	async function onSubmit(credentials: LogInCredentials) {
		try {
			const loggedInUser = await UserApi.logIn(credentials);
			onLoggedInSuccessfully(loggedInUser);
		} catch (error) {
			const message = extractErrorMessage(error as Error);
			setErrorMessage(message);
			setValue('password', '');
		}
	}

	useEffect(() => {
		setFocus('username');
		setErrorMessage('');
	}, [setFocus, setErrorMessage]);

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Log in</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorMessage && (
					<div className="w-100 text-danger mb-3">{errorMessage}</div>
				)}
				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						name="username"
						label="Username"
						type="text"
						placeholder="Username"
						register={register}
						registerOptions={{ required: 'Required' }}
						error={errors.username}
					/>

					<TextInputField
						name="password"
						label="Password"
						type="password"
						placeholder="Password"
						register={register}
						registerOptions={{ required: 'Required' }}
						error={errors.password}
					/>
					<Button type="submit" className="w-100" disabled={isSubmitting}>
						Log In
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
