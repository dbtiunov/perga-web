import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@common': path.resolve(__dirname, './src/common'),
      '@contexts': path.resolve(__dirname, './src/contexts'),

      '@sections': path.resolve(__dirname, './src/sections'),
      '@auth': path.resolve(__dirname, './src/sections/auth'),
      '@planner': path.resolve(__dirname, './src/sections/planner'),
      '@settings': path.resolve(__dirname, './src/sections/settings'),
    },
  },
});
