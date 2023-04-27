import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'process.env': process.env
  },
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7129", 
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 开启代理，允许跨域
        rewrite: (path) => path.replace(/^\/api/, ""),
      }
    }
  }
})
