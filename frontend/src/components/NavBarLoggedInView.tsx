import { Dropdown } from 'react-bootstrap';
import User from '../models/user';
import * as UserApi from '../network/userApi';
import { FaUserCircle } from 'react-icons/fa';
interface NavBarLoggedInViewProps {
	user: User;
	onLoggedOutSuccessfully: () => void;
	onChangePasswordClicked: () => void;
}

export default function NavBarLoggedInView({
	user,
	onLoggedOutSuccessfully,
	onChangePasswordClicked
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
			<Dropdown className="ms-auto">
				<Dropdown.Toggle id="user-options-dropdown" className="no-caret">
					<FaUserCircle className="me-2" size={30} />
					{user.username}
				</Dropdown.Toggle>

				<Dropdown.Menu variant="light">
					<Dropdown.Item onClick={onChangePasswordClicked}>
						Change password
					</Dropdown.Item>
					<Dropdown.Item onClick={logOut} className="text-danger">
						Log out
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</>
	);
}
