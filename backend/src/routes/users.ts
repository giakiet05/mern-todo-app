import express from 'express';
import * as UserController from '../controllers/users';

const router = express.Router();
router.get('/', UserController.getAuthenticatedUser);
router.post('/signup', UserController.signUp);
router.post('/login', UserController.logIn);
router.post('/logout', UserController.logOut);
router.post('/activate', UserController.activateUser);
router.post('/send-otp', UserController.sendOtp);
router.post(
	'/verify-otp-for-reset-password',
	UserController.verifyOtpForResetPassword
);
router.patch('/reset-password', UserController.resetPassword);
router.patch('/change-password', UserController.changePassword);
export default router;
