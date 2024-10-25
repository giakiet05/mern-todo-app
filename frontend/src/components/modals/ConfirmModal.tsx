import { Button, Modal } from 'react-bootstrap';
import { BsVariant } from '../../App';

interface ConfirmModalProps {
	title: string;
	description: string;
	confirmBtnContent: string;
	confirmBtnType: BsVariant;
	onDismiss: () => void;
	onConfirmed: () => void;
}

export default function ConfirmModal({
	title,
	onDismiss,
	description,
	onConfirmed,
	confirmBtnContent,
	confirmBtnType
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
				<Button variant={confirmBtnType} onClick={() => onConfirmed()}>
					{confirmBtnContent}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
