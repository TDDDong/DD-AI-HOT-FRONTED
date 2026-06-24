import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // twitter-cli 同步/拉关注可能超过默认代理超时，与前端 5 分钟对齐
        timeout: 300_000,
        proxyTimeout: 300_000,
      },
    },
  },
})
