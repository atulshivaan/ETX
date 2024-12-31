import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/register": {
        target: "http://localhost:3030/api/user/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/register/, "register"),
      },
      "/login": {
        target: "http://localhost:3030//api/user/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/login/, "login"),
      },
      
      "/addtransaction": {
        target: "http://localhost:3030/api/transaction/",
        changeOrigin: true,
      },
      "/gettransaction": {
        target: "http://localhost:3030/api/transaction/",
        changeOrigin: true,
      },
      "/editTransaction": {
        target: "http://localhost:3030/api/transaction/",
        changeOrigin: true,
      },
      "/deleteTransaction": {
        target: "http://localhost:3030/api/transaction/",
        changeOrigin: true,
      },
    },
  },
});
