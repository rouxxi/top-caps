import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  envDir: 'environments/',
  preview: {
    port: 8080,
    host: true,
    allowedHosts: true,
  }
})