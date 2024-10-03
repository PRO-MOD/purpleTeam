import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',  // Bind to 0.0.0.0 for Render
    port: process.env.PORT || 5000,  // Use Render's port if available
    https: false,
  },
  plugins: [react()]
});