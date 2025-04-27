import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5000,
    hmr: {
      clientPort: 443,
      host: '0.0.0.0'
    },
    watch: {
      usePolling: true
    },
    cors: true,
    strictPort: true,
    allowedHosts: 'all'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [NodeGlobalsPolyfillPlugin({ process: true, buffer: true })],
    },
  },
});