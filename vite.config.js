// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 凡是前端请求的路径以 /api 开头的，
      // 都将请求转发给 target 指定的地址。
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  }
})