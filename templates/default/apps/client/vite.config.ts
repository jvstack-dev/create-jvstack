import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { devtools } from "@tanstack/devtools-vite";
import babel from "@rolldown/plugin-babel";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "~admin": path.join(import.meta.dirname, "./src"),
      "~ui-web": path.join(import.meta.dirname, "../../packages/ui-web/src"),
    },
  },
  server: { port: 5000 },
});
