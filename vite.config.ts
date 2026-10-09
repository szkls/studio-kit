import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { studioPlugin, portDuProjet } from './scripts/vite-studio-plugin.ts'

// Chaque projet a son propre port, calculé à partir du nom de son dossier.
export default defineConfig({
  plugins: [react(), tailwindcss(), studioPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ecrans': path.resolve(__dirname, './ecrans'),
    },
  },
  server: { port: portDuProjet(__dirname), strictPort: false, open: false },
})
