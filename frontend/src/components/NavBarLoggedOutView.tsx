import { Button } from 'react-bootstrap';

interface NavBarLoggedOutViewProps {
	onLogInClicked: () => void;
	onSignUpclicked: () => void;
}

export default function NavBarLoggedOutView({
	onLogInClicked,
	onSignUpclicked
}: NavBarLoggedOutViewProps) {
	return (
		<>
			<Button onClick={onSignUpclicked}>Sign up</Button>
			<Button onClick={onLogInClicked}>Log in</Button>
		</>
	);
}
