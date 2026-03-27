import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // treat .js files as JSX
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'chunk-react': ['react', 'react-dom', 'react-router-dom'],
          'chunk-vendors': ['axios', 'socket.io-client', 'swiper'],
          'chunk-ui': ['react-bootstrap', 'bootstrap', 'react-icons', 'styled-components'],
        },
      },
    },
  },
});