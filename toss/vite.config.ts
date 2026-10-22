import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// `@/` = 레포 루트. 미니앱은 lib/backtest·lib/i18n·lib/tickers를 웹과 그대로 공유한다.
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: { alias: { "@": fileURLToPath(new URL("..", import.meta.url)) } },
  server: { host: "localhost", port: 5173, fs: { allow: [fileURLToPath(new URL("..", import.meta.url))] } },
  build: { outDir: "dist", emptyOutDir: true, target: "es2020" },
});
