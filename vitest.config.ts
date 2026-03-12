import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    server: {
      deps: {
        inline: [/@tailwindcss\/vite/, /@asamuzakjp\/css-color/, /@csstools\/css-calc/],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@common': path.resolve(__dirname, './src/common'),
      '@sections': path.resolve(__dirname, './src/sections'),
      '@auth': path.resolve(__dirname, './src/sections/auth'),
      '@planner': path.resolve(__dirname, './src/sections/planner'),
      '@settings': path.resolve(__dirname, './src/sections/settings'),
      '@notes': path.resolve(__dirname, './src/sections/notes'),
    },
  },
});
