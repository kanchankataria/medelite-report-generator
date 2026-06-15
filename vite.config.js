import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      "/cms-api": {
        target: "https://data.cms.gov",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/cms-api/, "/provider-data/api/1"),
      },
    },
  },
});
