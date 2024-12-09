import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import NavBar from './components/NavBar';
import { useEffect, useState } from 'react';
import SignUpModal from './components/modals/SignUpModal';
import LogInModal from './components/modals/LogInModal';
import User from './models/user';
import * as UserApi from './network/userApi';
import HomePage from './pages/HomePage';
import ChangePasswordModal from './components/modals/ChangePasswordModal';
import VerifyOtpModal from './components/modals/VerifyOtpModal';
import ResetPasswordModal from './components/modals/ResetPasswordModal';
import { OtpRequiredAction } from './types/enums';
import EnterEmailModal from './components/modals/EnterEmailModal';

export default function App() {
	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
	const [emailToVerify, setEmailToVerify] = useState<string | null>(null);
	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLogInModal, setShowLogInModal] = useState(false);
	const [showActivateUserModal, setShowActivateUserModal] = useState(false);
	const [showVerifyOtpModal, setShowVerifyOtpModal] = useState(false);
	const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
	const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
	const [showEnterEmailModal, setShowEnterEmailModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	useEffect(() => {
		async function getLoggedInUser() {
			try {
				const user = await UserApi.getLoggedInUser();

				setLoggedInUser(user);
			} catch (error) {
				const err = error as Error;
				setErrorMessage(err.message);
			}
		}

		getLoggedInUser();
	}, []);

	useEffect(() => {
		if (!loggedInUser) {
			return; // Skip session validation if the user is not logged in
		}

		async function validateSession() {
			try {
				const response = await UserApi.validateSession();
				console.log(response);
				if (!response.valid) {
					await UserApi.logOut();
					setLoggedInUser(null);
					alert('Your session has expired. Please log in again.');
				}
			} catch (error) {
				console.error('Error validating session:', error);
			}
		}

		const interval = setInterval(validateSession, 5 * 60 * 1000); // Check every 5 minutes

		return () => clearInterval(interval); // Cleanup on component unmount
	}, [loggedInUser]);

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
						setEmailToVerify(newUser.email);
						setShowSignUpModal(false);
						setShowActivateUserModal(true);
					}}
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
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
					onForgotPasswordClicked={() => {
						setShowEnterEmailModal(true);
						setShowLogInModal(false);
					}}
					onActivateClicked={async (email) => {
						setErrorMessage('');
						setEmailToVerify(email);
						setShowLogInModal(false);
						setShowActivateUserModal(true);
						await UserApi.sendOtp(email);
					}}
				/>
			)}
			{showChangePasswordModal && (
				<ChangePasswordModal
					onDismiss={() => setShowChangePasswordModal(false)}
					onChangedPasswordSuccessfully={() =>
						setShowChangePasswordModal(false)
					}
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
				/>
			)}
			{showActivateUserModal && emailToVerify && (
				<VerifyOtpModal
					label="We have sent an OTP to your email, please use it to activate your account"
					onDismiss={() => setShowActivateUserModal(false)}
					email={emailToVerify}
					onOtpVerifiedSuccessfully={() => {
						setShowLogInModal(true);
						setShowActivateUserModal(false);
					}}
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
					action={OtpRequiredAction.activateUser}
					onResendClicked={async () => {
						console.log(emailToVerify);
						await UserApi.sendOtp(emailToVerify);
					}}
				/>
			)}
			{showVerifyOtpModal && emailToVerify && (
				<VerifyOtpModal
					label="Enter the OTP sent to your email"
					onDismiss={() => setShowVerifyOtpModal(false)}
					email={emailToVerify}
					onOtpVerifiedSuccessfully={() => {
						setShowVerifyOtpModal(false);
						setShowResetPasswordModal(true);
					}}
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
					action={OtpRequiredAction.verifyForResetPassword}
					onResendClicked={async () => {
						await UserApi.sendOtp(emailToVerify);
					}}
				/>
			)}
			{showResetPasswordModal && emailToVerify && (
				<ResetPasswordModal
					onDismiss={() => setShowResetPasswordModal(false)}
					email={emailToVerify}
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
					onPasswordReset={() => {
						setEmailToVerify(null);
						setShowResetPasswordModal(false);
					}}
				/>
			)}
			{showEnterEmailModal && (
				<EnterEmailModal
					onDismiss={() => setShowEnterEmailModal(false)}
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
					onOtpSent={(email) => {
						setEmailToVerify(email);
						setErrorMessage('');
						setShowEnterEmailModal(false);
						setShowVerifyOtpModal(true);
					}}
				/>
			)}
		</div>
	);
}
