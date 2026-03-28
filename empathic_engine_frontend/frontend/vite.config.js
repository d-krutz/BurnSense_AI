import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-oxc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // ── INTEGRATION: proxy all /api calls to your FastAPI backend ──
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
