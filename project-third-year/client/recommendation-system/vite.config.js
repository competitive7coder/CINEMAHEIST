import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{js,jsx}',
    }),
  ],

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },

  build: {
    // warn if any chunk exceeds 500kb
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/react-router/')) {
            return 'chunk-react';
          }

          // UI libraries
          if (id.includes('node_modules/react-bootstrap/') ||
              id.includes('node_modules/bootstrap/') ||
              id.includes('node_modules/react-icons/') ||
              id.includes('node_modules/styled-components/')) {
            return 'chunk-ui';
          }

          // Heavy libraries — each gets its own chunk
          if (id.includes('node_modules/swiper/')) {
            return 'chunk-swiper';
          }

          if (id.includes('node_modules/socket.io-client/') ||
              id.includes('node_modules/engine.io-client/')) {
            return 'chunk-socket';
          }

          if (id.includes('node_modules/axios/')) {
            return 'chunk-axios';
          }

          // Everything else from node_modules
          if (id.includes('node_modules/')) {
            return 'chunk-vendors';
          }
        },
      },
    },
  },
});