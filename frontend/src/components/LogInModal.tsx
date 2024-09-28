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
}

export default function LogInModal({
	onDismiss,
	onLoggedInSuccessfully
}: LogInModalProps) {
	const {
		register,
		handleSubmit,
		setFocus,
		formState: { errors, isSubmitting }
	} = useForm<LogInCredentials>();

	async function onSubmit(credentials: LogInCredentials) {
		try {
			const loggedInUser = await UserApi.logIn(credentials);
			onLoggedInSuccessfully(loggedInUser);
		} catch (error) {
			alert(error);
		}
	}

	useEffect(() => {
		setFocus('username');
	}, [setFocus]);

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Log in</Modal.Title>
			</Modal.Header>
			<Modal.Body>
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
