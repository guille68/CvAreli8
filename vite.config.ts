import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/CvAreli8/' : '/', // <-- Cambia 'CvAreli8' si tu repo tiene otro nombre
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
