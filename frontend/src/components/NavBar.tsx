import { Nav, Navbar } from 'react-bootstrap';
import User from '../models/user';
import NavBarLoggedInView from './NavBarLoggedInView';
import NavBarLoggedOutView from './NavBarLoggedOutView';
import { Link } from 'react-router-dom';

interface NavBarProps {
	loggedInUser: User | null;
	onSignUpClicked: () => void;
	onLogInClicked: () => void;
	onLoggedOutSuccessfully: () => void;
	onChangePasswordClicked: () => void;
}

export default function NavBar({
	loggedInUser,
	onLogInClicked,
	onLoggedOutSuccessfully,
	onSignUpClicked,
	onChangePasswordClicked
}: NavBarProps) {
	return (
		<Navbar bg="primary" className="px-5" fixed="top">
			<Navbar.Brand as={Link} to="/" className="text-white">
				TODO LIST
			</Navbar.Brand>
			<Nav className="ms-auto">
				{loggedInUser ? (
					<NavBarLoggedInView
						user={loggedInUser}
						onLoggedOutSuccessfully={onLoggedOutSuccessfully}
						onChangePasswordClicked={onChangePasswordClicked}
					/>
				) : (
					<NavBarLoggedOutView
						onLogInClicked={onLogInClicked}
						onSignUpclicked={onSignUpClicked}
					/>
				)}
			</Nav>
		</Navbar>
	);
}
