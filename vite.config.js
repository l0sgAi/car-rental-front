import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 部署路径，根据你的仓库名称设置
  base: '/car-rental-front/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        // TODO 修改为后端接口地址
        target: 'http://127.0.0.1:8575',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    // 构建输出目录
    outDir: 'dist',
    // 生成源映射文件
    sourcemap: false,
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'ui': ['naive-ui']
        }
      }
    }
  }
})
