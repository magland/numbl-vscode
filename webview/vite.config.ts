import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, "..", "dist-webview"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "main.tsx"),
      output: {
        entryFileNames: "main.js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
