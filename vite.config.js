// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 规则的含义：凡是前端请求的路径以 /api 开头的，
      // 都将请求转发给 target 指定的地址。
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        // 【重要】删掉 rewrite 这一行！
        // 这样，前端请求 /api/videos 就会被原封不动地转发到 http://localhost:8081/api/videos
      }
    }
  }
})