import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    react(),
  ],

  resolve: {
    dedupe: ['react', 'react-dom'],
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 500,
    cssCodeSplit: false, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/') ||
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/react-router/')) {
            return 'chunk-react';
          }
          if (id.includes('node_modules/react-bootstrap/') ||
              id.includes('node_modules/bootstrap/') ||
              id.includes('node_modules/react-icons/') ||
              id.includes('node_modules/styled-components/')) {
            return 'chunk-ui';
          }
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
          if (id.includes('node_modules/')) {
            return 'chunk-vendors';
          }
        },
      },
    },
  },
});