import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import TextInputField from '../form/TextInputField';
import { useEffect } from 'react';
import * as UserApi from '../../network/userApi';
import { CustomError } from '../../types/CustomError';
interface EnterEmailModalProps {
	onDismiss: () => void;
	onOtpSent: (email: string) => void;
	errorMessage: string;
	setErrorMessage: (message: string) => void;
}

export default function EnterEmailModal({
	onDismiss,
	errorMessage,
	setErrorMessage,
	onOtpSent
}: EnterEmailModalProps) {
	interface FormBody {
		email: string;
	}
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setFocus
	} = useForm<FormBody>();

	async function onSubmit(input: FormBody) {
		try {
			//await UserApi.checkExistingUser(input.email);
			await UserApi.sendOtp(input.email);
			console.log('hello');
			onOtpSent(input.email);
		} catch (error) {
			const customError = error as CustomError;
			setErrorMessage(customError.errorMessage);
		}
	}

	useEffect(() => {
		setFocus('email');
	}, [setFocus]);

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Enter email</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorMessage && (
					<div className="w-100 text-danger mb-3">{errorMessage}</div>
				)}
				<Form noValidate onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						type="email"
						name="email"
						label="Enter your email to receive an OTP"
						register={register}
						registerOptions={{
							required: 'This field is required'
						}}
						error={errors.email}
						placeholder="Your email"
					/>
					<Button className="w-100" type="submit" disabled={isSubmitting}>
						Submit
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
