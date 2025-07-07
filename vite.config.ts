import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations
  build: {
    // Enable source maps for production debugging (can be disabled for smaller builds)
    sourcemap: false,
    
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk for React and related libraries
          vendor: ['react', 'react-dom'],
          
          // Utils chunk for utility functions
          utils: ['./src/utils/arrayUtils', './src/utils/localStorage', './src/utils/defaultWords']
        }
      }
    },
    
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Set chunk size warning limit
    chunkSizeWarningLimit: 600,
    
    // Target modern browsers for smaller bundle
    target: 'es2020'
  },
  
  // CSS optimization
  css: {
    devSourcemap: true,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    // Pre-bundle React and other dependencies
    include: ['react', 'react-dom'],
  },
  
  // Preview server settings for testing production builds
  preview: {
    port: 3000,
    open: true
  }
}) 