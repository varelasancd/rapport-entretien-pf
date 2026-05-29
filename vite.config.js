import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" => fonctionne sur GitHub Pages, Netlify, Vercel, ou en local
// (chemins relatifs, indépendant du nom du dépôt)
export default defineConfig({
  plugins: [react()],
  base: "./",
});
