import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // Point to project root for .env file (one level up from vite.config.ts location)
  envDir: __dirname,

  // Set root to examples directory
  root: resolve(__dirname, 'examples'),

  // Enable source map for debugging
  build: {
    sourcemap: true,
  },

  // Development server configuration
  server: {
    port: 3000,
    open: false,
  },
});
