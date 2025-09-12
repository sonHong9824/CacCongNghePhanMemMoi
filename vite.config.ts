import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";
import pkg from "./package.json";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    // tạo .d.ts vào dist; insertTypesEntry giúp tự set types entry/exports
    dts({
      insertTypesEntry: true,   // chèn entry types vào package.json nếu có thể
      // rollupTypes: true         // (tùy chọn) gộp types thành 1 file index.d.ts
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "CartUI",
      fileName: (format) => `cart-ui.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      // external hoá react để không bundle vào library
      external: ["react", "react-dom", ...Object.keys(pkg.peerDependencies || {})],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
