import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
  // Standard local development server config.
  // NOTE: The previous Replit-specific settings (host: '0.0.0.0', allowedHosts: true,
  // hmr: { clientPort: 443 }) have been removed. Those settings disabled host checking
  // (DNS rebinding risk) and assumed an HTTPS reverse proxy, which broke local dev.
  // If deploying to Replit or a similar platform, configure via environment variables
  // or a separate vite.replit.config.ts file rather than modifying this base config.
  server: {
    port: 5173,
  },
});