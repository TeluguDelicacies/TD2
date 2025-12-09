import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 8000,
    open: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
