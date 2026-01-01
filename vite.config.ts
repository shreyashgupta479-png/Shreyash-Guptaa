import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use (process as any).cwd() to satisfy TypeScript in the Vite configuration context where Node types might be minimal
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env.ADMIN_KEY': JSON.stringify(env.ADMIN_KEY || '5a40dcc0a2b2a1b89a9b195e9315da2a'),
    },
    server: {
      host: '0.0.0.0',
      port: parseInt(env.PORT) || 5173,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            genai: ['@google/genai'],
          },
        },
      },
    },
  };
});