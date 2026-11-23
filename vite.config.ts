
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./", // This ensures relative paths in the built files
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      devOptions: { enabled: false },
      filename: "sw.js",
      includeAssets: ["favicon.png", "icon.png"],
      manifest: {
        name: "AI Vision Command Center",
        short_name: "AI Vision",
        description: "Offline-first command center for humans and AI agents.",
        start_url: "./",
        display: "standalone",
        background_color: "#0b1020",
        theme_color: "#0b1020",
        icons: [{ src: "icon.png", sizes: "512x512", type: "image/png", purpose: "any" }],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        runtimeCaching: [
          { urlPattern: ({ request }) => request.mode === "navigate", handler: "NetworkFirst", options: { cacheName: "pages" } },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ensure assets are in the right place for Electron
    assetsDir: "assets",
    outDir: "dist",
    // Force relative paths for all assets
    rollupOptions: {
      output: {
        // Ensure all asset references are relative
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        format: 'es'
      }
    },
    // Disable sourcemap for production build
    sourcemap: false,
    minify: 'terser',
    // Ensure relative paths
    cssCodeSplit: false
  }
}));
