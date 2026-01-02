import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: 'all',
    origin: 'https://96428ea3d922.ngrok-free.app',
  },
})
