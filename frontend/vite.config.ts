/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: 'https://mern-todo-app-backend-ta4u.onrender.com'
			}
		}
	}
});
