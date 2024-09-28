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
}

export default function NavBar({
	loggedInUser,
	onLogInClicked,
	onLoggedOutSuccessfully,
	onSignUpClicked
}: NavBarProps) {
	return (
		<Navbar bg="primary" data-bs-theme="dark" className="px-5" fixed="top">
			<Navbar.Brand as={Link} to="/">
				MERN TODO APP
			</Navbar.Brand>
			<Nav className="ms-auto">
				{loggedInUser ? (
					<NavBarLoggedInView
						user={loggedInUser}
						onLoggedOutSuccessfully={onLoggedOutSuccessfully}
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
