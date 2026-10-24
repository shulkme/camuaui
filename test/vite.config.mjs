import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";

export default defineConfig({
  root: fileURLToPath(new URL("./", import.meta.url)),
  cacheDir: fileURLToPath(new URL("../node_modules/.vite", import.meta.url)),
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss()] } },
  server: {
    host: "127.0.0.1",
    port: 3001,
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL("../", import.meta.url))] },
  },
  preview: { host: "127.0.0.1", port: 3001, strictPort: true },
});
