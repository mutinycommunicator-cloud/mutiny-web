import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// GitHub Pages base: must match your repo folder name
const DEFAULT_BASE = "/mutiny-web/";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Allow override via VITE_BASE, otherwise use DEFAULT_BASE
  const base = env.VITE_BASE && env.VITE_BASE.trim() !== ""
    ? env.VITE_BASE
    : DEFAULT_BASE;

  return {
    base,

    plugins: [
      react({
        jsxImportSource: "react",
        babel: {
          plugins: [
            // keeps component names readable in dev
            ["@babel/plugin-transform-react-jsx-source", { runtime: "automatic" }]
          ]
        }
      })
    ],

    resolve: {
      alias: {
        "@": resolve(__dirname, "src")
      }
    },

    define: {
      __APP_ENV__: JSON.stringify(mode),
    },

    server: {
      port: 5173,
      strictPort: true,
      open: true,
      cors: true
    },

    preview: {
      port: 5173,
      strictPort: true
    },

    build: {
      target: "es2020",
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: mode !== "production",
      rollupOptions: {
        output: {
          // Split big deps into separate chunks for better caching
          manualChunks: {
            react: ["react", "react-dom"]
          }
        }
      }
    }
  };
});
