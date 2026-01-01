import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // 1. Router plugin MUST come first to generate routeTree.gen.ts
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    // 2. React plugin follows
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
})
