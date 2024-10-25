import 'dotenv/config';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import env from './validateEnv';

export function generateOTP() {
	return crypto.randomInt(100000, 999999).toString(); // 6-digit number
}

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: env.EMAIL_USER,
		pass: env.EMAIL_PASS
	}
});

export async function sendOTPEmail(userEmail: string, otp: string) {
	const text = `Dear user, 

	Thank you for using TODOLIST! 
	
	Your One-Time Password (OTP) is ${otp}. Please enter this code within 10 minutes to complete your account verification.
	
	If you did not request this code, please ignore this email.
	
	Best regards, 
	TODOLIST Team`;

	const html = `
			<p>Dear user,</p>
			<p>Thank you for using <strong>TODOLIST</strong>!</p>
			<p>Your One-Time Password (OTP) is: </p>
			<h1>${otp}</h1>
			<p>Please enter this code within the next <strong>10 minutes</strong> to complete your account verification.</p>
			<p>If you did not request this code, please ignore this email.</p>
			<br>
			<p>Best regards,<br><strong>TODOLIST Team</strong></p>
		`;

	const mailOptions = {
		from: `TODOLIST <${env.EMAIL_USER}>`,
		to: userEmail,
		subject: 'OTP for activating your TODOLIST account',
		text: text,
		html: html
	};

	const info = await transporter.sendMail(mailOptions);

	console.log('Mail sent successfully' + info.messageId);
}
