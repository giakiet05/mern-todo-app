import { Button, Modal } from 'react-bootstrap';

interface ConfirmModalProps {
	title: string;
	description: string;
	action: string;
	onDismiss: () => void;
	onConfirmed: () => void;
}

export default function ConfirmModal({
	title,
	onDismiss,
	description,
	onConfirmed,
	action
}: ConfirmModalProps) {
	return (
		<Modal show onHide={() => onDismiss()}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{description}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => onDismiss()}>
					Cancel
				</Button>
				<Button variant="danger" onClick={() => onConfirmed()}>
					{action}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
