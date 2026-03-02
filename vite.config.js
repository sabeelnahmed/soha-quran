import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: () => '/openai/v1/chat/completions',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', `Bearer ${process.env.VITE_GROQ_API_KEY}`);
          });
        },
      },
    },
  },
})
