import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  preview: {
    port: parseInt(JSON.stringify(process.env.VITE_PORT)) || 8080,
    host: true
  }
})