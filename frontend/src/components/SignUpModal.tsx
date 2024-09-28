import { Button, Form, Modal } from 'react-bootstrap';
import TextInputField from './form/TextInputField';
import { useForm } from 'react-hook-form';
import { SignUpCredentials } from '../network/userApi';
import User from '../models/user';
import * as UserApi from '../network/userApi';
import { useEffect } from 'react';

interface SignUpModalProps {
	onDismiss: () => void;
	onSignedUpSuccessfully: (user: User) => void;
}

export default function SignUpModal({
	onDismiss,
	onSignedUpSuccessfully
}: SignUpModalProps) {
	const {
		register,
		handleSubmit,
		setFocus,
		formState: { errors, isSubmitting }
	} = useForm<SignUpCredentials>();

	async function onSubmit(credentials: SignUpCredentials) {
		try {
			const newUser = await UserApi.signUp(credentials);
			onSignedUpSuccessfully(newUser);
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
				<Modal.Title>Sign up</Modal.Title>
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
						name="email"
						label="Email"
						type="email"
						placeholder="Email"
						register={register}
						registerOptions={{ required: 'Required' }}
						error={errors.email}
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
						Sign Up
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
