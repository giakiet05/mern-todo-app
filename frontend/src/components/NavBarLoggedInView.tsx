import { Button, Navbar } from 'react-bootstrap';
import User from '../models/user';
import * as UserApi from '../network/userApi';
interface NavBarLoggedInViewProps {
	user: User;
	onLoggedOutSuccessfully: () => void;
}

export default function NavBarLoggedInView({
	user,
	onLoggedOutSuccessfully
}: NavBarLoggedInViewProps) {
	async function logOut() {
		try {
			await UserApi.logOut();
			onLoggedOutSuccessfully();
		} catch (error) {
			alert(error);
		}
	}

	return (
		<>
			<Navbar.Text className="me-2">Signed in as: {user.username}</Navbar.Text>
			<Button onClick={logOut}>Log out</Button>
		</>
	);
}
