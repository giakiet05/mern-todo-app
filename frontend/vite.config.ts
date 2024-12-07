import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
	// Load env variables based on `mode` (e.g., 'development' or 'production')
	// const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [react()],
		server: {
			proxy: {
				'/api': {
					target: 'https://mern-todo-app-backend-ta4u.onrender.com'
				}
			}
		}
	};
});
