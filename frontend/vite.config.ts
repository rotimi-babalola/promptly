import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@auth': '/src/pages/auth',
      '@landing': '/src/pages/landing',
      '@dashboard': '/src/pages/dashboard',
      '@speak': '/src/pages/speak',
    },
  },
  plugins: [react(), tailwindcss()],
});
