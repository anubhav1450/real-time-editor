import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [ react(), tailwindcss() ],
  worker: {
    format: "es",
  },
  build: {
    // Monaco is a few MB on its own; it is lazy-loaded with the editor page.
    chunkSizeWarningLimit: 5000,
  },
})
