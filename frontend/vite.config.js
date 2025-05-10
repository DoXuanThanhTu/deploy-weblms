import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  base: "/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index.html",
    },
  },
});
