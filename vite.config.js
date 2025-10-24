import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  
  return {
  plugins: [
    vue(),
    // 构建完成后自动创建 404.html（GitHub Pages SPA 支持）
    {
      name: 'generate-404',
      closeBundle() {
        try {
          copyFileSync(
            resolve(__dirname, 'dist/index.html'),
            resolve(__dirname, 'dist/404.html')
          )
          console.log('✓ 404.html created for GitHub Pages SPA support')
        } catch (err) {
          console.error('Failed to create 404.html:', err)
        }
      }
    }
  ],
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
        // 后端接口地址，从环境变量读取
        target: env.VITE_API_BASE_URL,
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
}})
