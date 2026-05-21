// @ts-check

import { defineConfig, globalIgnores } from "eslint/config";
import baseConfig from "@__APP_NAME__/config/eslint";
import reactHooks from "eslint-plugin-react-hooks";
import tailwind from "eslint-plugin-better-tailwindcss";
import reactRefresh from "eslint-plugin-react-refresh";
import path from "node:path";
import globals from "globals";

export default defineConfig([
  ...baseConfig,
  globalIgnores([".vite"]),
  reactHooks.configs.flat["recommended-latest"],
  reactRefresh.configs.vite,
  tailwind.configs["recommended-error"],
  { settings: { "better-tailwindcss": { entryPoint: path.join(import.meta.dirname, "./lib/index.css") } } },
  { languageOptions: { globals: globals.browser } },
  { rules: { "better-tailwindcss/enforce-consistent-line-wrapping": "off" } },
]);
