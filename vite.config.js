import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  base: '/Bingo/', // IMPORTANTE: Define a rota base para o deploy no GitHub Pages
})
