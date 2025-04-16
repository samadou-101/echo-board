import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": "/src/components",
      "@utils": "/src/utils",
      "@pages": "/src/pages",
      "@redux": "/src/redux",
      "@hooks": "/src/hooks",
      "@schema": "/src/schema",
      "@config": "/src/config",
      "@services": "/src/services",
      "@lib": "/src/lib",
      "@assets": "/src/assets",
    },
  },
});
