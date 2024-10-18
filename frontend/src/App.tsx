/* eslint-disable react-hooks/exhaustive-deps */
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import NavBar from './components/NavBar';
import { useEffect, useState } from 'react';
import SignUpModal from './components/SignUpModal';
import LogInModal from './components/LogInModal';
import User from './models/user';
import * as UserApi from './network/userApi';
import HomePage from './pages/HomePage';
import ChangePasswordModal from './components/ChangePasswordModal';

export default function App() {
	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLogInModal, setShowLogInModal] = useState(false);
	const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	useEffect(() => {
		async function getLoggedInUser() {
			try {
				const user = await UserApi.getLoggedInUser();
				setLoggedInUser(user);
			} catch (error) {
				const err = error as Error;
				setErrorMessage(err.message);
				alert(errorMessage);
			}
		}
		getLoggedInUser();
	}, []);

	function extractErrorMessage(error: Error): string {
		const errorMessage =
			error.message.split('message: ')[1] || 'An error occurred';
		return errorMessage;
	}

	return (
		<div className="app">
			<NavBar
				loggedInUser={loggedInUser}
				onLogInClicked={() => setShowLogInModal(true)}
				onSignUpClicked={() => setShowSignUpModal(true)}
				onChangePasswordClicked={() => setShowChangePasswordModal(true)}
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
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
					extractErrorMessage={extractErrorMessage}
				/>
			)}
			{showLogInModal && (
				<LogInModal
					onDismiss={() => setShowLogInModal(false)}
					onLoggedInSuccessfully={(user) => {
						setLoggedInUser(user);
						setShowLogInModal(false);
					}}
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
					extractErrorMessage={extractErrorMessage}
				/>
			)}
			{showChangePasswordModal && (
				<ChangePasswordModal
					onDismiss={() => setShowChangePasswordModal(false)}
					onChangedPasswordSuccessfully={() =>
						setShowChangePasswordModal(false)
					}
				/>
			)}
		</div>
	);
}
