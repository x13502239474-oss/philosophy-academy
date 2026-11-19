import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 相对路径构建：产物可放在 GitHub Pages 仓库根目录或任意子目录
export default defineConfig({
  base: './',
  plugins: [react()],
})
