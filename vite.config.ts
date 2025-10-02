import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: "/mutiny-web/",                 // must match your repo name on GitHub
  plugins: [react()],
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  build: { outDir: "docs", emptyOutDir: true }
});
