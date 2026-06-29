import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // During local dev, /api/* is forwarded to the Express proxy server
      // (server/index.js) so the RAWG API key never reaches the browser.
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
