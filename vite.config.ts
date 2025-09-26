import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const DEFAULT_BASE = "/mutiny-web/";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE && env.VITE_BASE.trim() !== "" ? env.VITE_BASE : DEFAULT_BASE;

  return {
    base,
    // 🚫 No extra Babel plugins; the React plugin handles dev transforms itself
    plugins: [react()],
    resolve: { alias: { "@": resolve(__dirname, "src") } },
    define: { __APP_ENV__: JSON.stringify(mode) },
    server: { port: 5173, strictPort: true, open: true, cors: true },
    preview:{ port: 5173, strictPort: true },
    build: {
      target: "es2020",
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: mode !== "production",
      rollupOptions: { output: { manualChunks: { react: ["react","react-dom"] } } }
    }
  };
});
