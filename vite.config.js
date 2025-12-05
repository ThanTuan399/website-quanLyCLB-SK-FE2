import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(
{
  plugins: [react()],
  build: 
  {
    // 1. Tăng giới hạn cảnh báo lên 1000kb (để đỡ bị spam warning nếu file hơi to xíu)
    chunkSizeWarningLimit: 1000, 
    
    // 2. Cấu hình chia nhỏ (Rollup Options)
    rollupOptions: 
    {
        output: 
        {
            manualChunks(id) 
            {
                // Nếu code nằm trong node_modules, gom nó vào file riêng tên là "vendor"
                if (id.includes('node_modules')) 
                  {
                    return 'vendor';
                  }
            },
        },
    },
  },
})