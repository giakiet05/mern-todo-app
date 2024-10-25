import { Button, Form, Modal } from 'react-bootstrap';
import TextInputField from '../form/TextInputField';
import { useForm } from 'react-hook-form';
import * as UserApi from '../../network/userApi';
import { LogInCredentials } from '../../network/userApi';
import User from '../../models/user';
import { useEffect, useState } from 'react';
import { CustomError } from '../../types/CustomError';
import { ErrorCode } from '../../types/ErrorCode';
interface LogInModalProps {
	onDismiss: () => void;
	onLoggedInSuccessfully: (user: User) => void;
	errorMessage: string;
	setErrorMessage: (message: string) => void;
	onActivateClicked: (email: string) => void;
	onForgotPasswordClicked: () => void;
}

export default function LogInModal({
	onDismiss,
	onLoggedInSuccessfully,
	errorMessage,
	setErrorMessage,
	onForgotPasswordClicked,
	onActivateClicked
}: LogInModalProps) {
	const {
		register,
		handleSubmit,
		setFocus,
		setValue,
		formState: { errors, isSubmitting }
	} = useForm<LogInCredentials>();

	const [errorCode, setErrorCode] = useState<ErrorCode>();
	const [email, setEmail] = useState('');
	async function onSubmit(credentials: LogInCredentials) {
		try {
			const loggedInUser = await UserApi.logIn(credentials);
			onLoggedInSuccessfully(loggedInUser);
		} catch (error) {
			const customError = error as CustomError;
			setErrorMessage(customError.errorMessage);
			setErrorCode(customError.errorCode as ErrorCode);
			setEmail(credentials.email);
			setValue('password', '');
		}
	}

	useEffect(() => {
		setFocus('email');
		setErrorMessage('');
	}, [setFocus, setErrorMessage]);

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Log in</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorMessage && (
					<div className="w-100 text-danger mb-3">
						{errorMessage}
						{errorCode === ErrorCode.ACCOUNT_NOT_ACTIVATED && (
							<a
								href="#"
								className="ms-2"
								onClick={() => onActivateClicked(email)}
							>
								Click here to activate
							</a>
						)}
					</div>
				)}

				<Form noValidate onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						name="email"
						label="Email"
						type="email"
						placeholder="e.g: johndoe123@gmail.com"
						register={register}
						registerOptions={{ required: 'An email is required' }}
						error={errors.email}
					/>

					<TextInputField
						name="password"
						label="Password"
						type="password"
						placeholder="Your password"
						register={register}
						registerOptions={{ required: 'A password is required' }}
						error={errors.password}
					/>
					<Button type="submit" className="w-100" disabled={isSubmitting}>
						Log in
					</Button>
				</Form>
				<span
					className="float-end mt-3 me-2 text-primary"
					style={{ cursor: 'pointer' }}
					onClick={onForgotPasswordClicked}
				>
					Forgot password?
				</span>
			</Modal.Body>
		</Modal>
	);
}
