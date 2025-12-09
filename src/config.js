import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000,
    open: true,
    host: true,
    cors: true,
    fs: {
      allow: ['..']
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          leaflet: ['leaflet', 'react-leaflet'],
          geo: ['@turf/turf', 'proj4'],
          utils: ['uuid']
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    minify: 'esbuild',
    target: 'esnext'
  },
  
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'leaflet', 
      'react-leaflet',
      '@turf/turf',
      'proj4',
      'uuid'
    ],
    exclude: ['@turf/turf']
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@core': resolve(__dirname, './src/core'),
      '@plugins': resolve(__dirname, './src/plugins'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles')
    }
  },
  
  // Variables d'environnement
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
  }
})