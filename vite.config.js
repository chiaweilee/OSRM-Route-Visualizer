import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const base = command === 'build' ? '/OSRM-Route-Visualizer/' : '/'

  return {
    base,
    plugins: [vue()],
  }
})
