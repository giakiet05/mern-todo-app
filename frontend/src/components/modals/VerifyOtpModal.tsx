import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import TextInputField from '../form/TextInputField';
import { useEffect } from 'react';
import * as UserApi from '../../network/userApi';
import { OtpRequiredAction } from '../../types/enums';
import { CustomError } from '../../types/CustomError';

interface VerifyOtpModalProps {
	label: string;
	onDismiss: () => void;
	email: string;
	onOtpVerifiedSuccessfully: () => void;

	errorMessage: string;
	setErrorMessage: (message: string) => void;
	action: OtpRequiredAction;
	onResendClicked: () => void;
}

export default function VerifyOtpModal({
	label,
	onDismiss,
	email,
	errorMessage,
	action,
	setErrorMessage,
	onOtpVerifiedSuccessfully,

	onResendClicked
}: VerifyOtpModalProps) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
		setFocus
	} = useForm<FormBody>();

	interface FormBody {
		otp: string;
	}

	async function onSubmit(input: FormBody) {
		const credentials = {
			email: email,
			otp: input.otp
		};
		console.log(credentials);
		try {
			if (action === OtpRequiredAction.activateUser)
				await UserApi.activateUser(credentials);
			else if (action === OtpRequiredAction.verifyForResetPassword)
				await UserApi.verifyOtpForResetPassword(credentials);
			onOtpVerifiedSuccessfully();
		} catch (error) {
			const customError = error as CustomError;
			setErrorMessage(customError.errorMessage);
			setValue('otp', '');
		}
	}

	useEffect(() => {
		setFocus('otp'); // Programmatically focus the "name" field
	}, [setFocus]);

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>{action}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorMessage && (
					<div className="w-100 text-danger mb-3">{errorMessage}</div>
				)}
				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						type="text"
						name="otp"
						label={label}
						register={register}
						registerOptions={{
							required: 'This field is required'
						}}
						error={errors.otp}
						placeholder="6-digit OTP"
					/>
					<Button className="w-100" type="submit" disabled={isSubmitting}>
						Submit
					</Button>
				</Form>
				<span
					className="float-end mt-3 me-2 text-primary"
					style={{ cursor: 'pointer' }}
					onClick={onResendClicked}
				>
					Resend OTP
				</span>
			</Modal.Body>
		</Modal>
	);
}
