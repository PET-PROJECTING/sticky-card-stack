import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: 'tsconfig.lib.json',
      outDir: 'dist',
      entryRoot: 'src',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'scs',
      fileName: 'scs',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'gsap', 'gsap/ScrollTrigger', 'lenis'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          gsap: 'gsap',
          lenis: 'Lenis',
        },
        assetFileNames: (assetInfo) =>
          assetInfo.name === 'style.css' || assetInfo.name === 'StickyCardStack.css'
            ? 'scs.css'
            : '[name][extname]',
      },
    },
    sourcemap: true,
    minify: true,
  },
});
