import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import NavBar from './components/NavBar';
import { useEffect, useState } from 'react';
import SignUpModal from './components/SignUpModal';
import LogInModal from './components/LogInModal';
import User from './models/user';
import * as UserApi from './network/userApi';
import HomePage from './pages/HomePage';

export default function App() {
	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLogInModal, setShowLogInModal] = useState(false);

	useEffect(() => {
		async function getLoggedInUser() {
			try {
				const user = await UserApi.getLoggedInUser();
				setLoggedInUser(user);
			} catch (error) {
				alert(error);
			}
		}
		getLoggedInUser();
	}, []);

	return (
		<div className="app">
			<NavBar
				loggedInUser={loggedInUser}
				onLogInClicked={() => setShowLogInModal(true)}
				onSignUpClicked={() => setShowSignUpModal(true)}
				onLoggedOutSuccessfully={() => {
					setLoggedInUser(null);
				}}
			/>
			<HomePage loggedInUser={loggedInUser} />;
			{showSignUpModal && (
				<SignUpModal
					onDismiss={() => setShowSignUpModal(false)}
					onSignedUpSuccessfully={(newUser) => {
						setLoggedInUser(newUser);
						setShowSignUpModal(false);
					}}
				/>
			)}
			{showLogInModal && (
				<LogInModal
					onDismiss={() => setShowLogInModal(false)}
					onLoggedInSuccessfully={(user) => {
						setLoggedInUser(user);
						setShowLogInModal(false);
					}}
				/>
			)}
		</div>
	);
}
