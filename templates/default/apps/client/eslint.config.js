// @ts-check

import { defineConfig, globalIgnores } from "eslint/config";
import baseConfig from "@__APP_NAME__/config/eslint";
import reactHooks from "eslint-plugin-react-hooks";
import tailwind from "eslint-plugin-better-tailwindcss";
import path from "node:path";
import globals from "globals";

export default defineConfig([
  ...baseConfig,
  globalIgnores([".vite", ".tanstack", "routeTree.gen.ts"]),
  reactHooks.configs.flat["recommended-latest"],
  tailwind.configs["recommended-error"],
  { settings: { "better-tailwindcss": { entryPoint: path.join(import.meta.dirname, "./src/index.css") } } },
  { languageOptions: { globals: globals.node } },
  { rules: { "better-tailwindcss/enforce-consistent-line-wrapping": "off" } },
]);
