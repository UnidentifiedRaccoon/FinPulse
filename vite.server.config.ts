import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist-server',
    ssr: 'server/index.ts',
    target: 'node22',
    rollupOptions: {
      output: {
        entryFileNames: 'server/index.js',
        chunkFileNames: 'server/chunks/[name]-[hash].js',
      },
    },
  },
})
