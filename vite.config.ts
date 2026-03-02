import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    // NOTE: GEMINI_API_KEY must NOT be exposed to the client.
    // It is used server-side only in /api/clean-description.
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    assetsInclude: ['**/*.glb'],
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
