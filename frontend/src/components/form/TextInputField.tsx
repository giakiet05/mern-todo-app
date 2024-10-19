import { Form } from 'react-bootstrap';
import { FieldError, RegisterOptions, UseFormRegister } from 'react-hook-form';

interface TextInputFieldProps {
	name: string;
	label: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	register: UseFormRegister<any>;
	registerOptions?: RegisterOptions;
	error?: FieldError;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[x: string]: any;
}

export default function TextInputField({
	name,
	label,
	register,
	registerOptions,
	error,
	...props
}: TextInputFieldProps) {
	return (
		<Form.Group noValidate className="mb-3" controlId={name + '-input'}>
			<Form.Label>{label}</Form.Label>
			<Form.Control
				style={{ resize: 'none' }}
				{...props}
				{...register(name, registerOptions)}
				isInvalid={!!error}
			/>

			<Form.Control.Feedback type="invalid">
				{error?.message}
			</Form.Control.Feedback>
		</Form.Group>
	);
}
