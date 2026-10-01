import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // モバイル端末（やや古い iOS Safari / Android Chrome）でも動作するよう
    // 広めのブラウザターゲットへトランスパイルする。
    target: ['es2020', 'safari14', 'ios14', 'chrome87'],
  },
  server: {
    host: true,
    port: 80,
    proxy: {
      '/api': 'http://api:3000/',
      '/ws': {
        target: 'http://api:3000',
        ws: true,
      },
    },
  },
})
