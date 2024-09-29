import { defineConfig } from 'vite';
// import { resolve } from 'path';
import react from '@vitejs/plugin-react';
// import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // dts({ include: ['lib'] })
  ],
  build: {
    // lib: {
    //   entry: resolve(__dirname, 'lib/arcpay.ts'),
    //   formats: ['es'],
    // },
    // rollupOptions: {
    //   external: ['react', 'react/jsx-runtime'],
    // },
  },
});
