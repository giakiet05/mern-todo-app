import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
	// Load env variables based on `mode` (e.g., 'development' or 'production')
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [react()],
		server: {
			proxy: {
				'/api': {
					target: env.VITE_API_URL || 'http://localhost:5000' // Use env variable with a fallback
				}
			}
		}
	};
});
