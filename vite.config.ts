import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // resolve: {
  //   alias: {
  //     '@': resolve(__dirname, 'src'),
  //   },
  // },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
    // Config options for production build
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ant-design': ['ant-design-vue'],
          'charts': ['highcharts'],
        }
      }
    }
  }
})
