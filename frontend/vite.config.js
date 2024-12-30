import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/register': {
        target: 'http://localhost:3030/api/auth/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/register/, 'register'),
      },
      '/login': {
        target: 'http://localhost:3030/api/auth/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/login/, 'login'),
      },
    },
  },
});