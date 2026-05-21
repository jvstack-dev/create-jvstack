// @ts-check

import { defineConfig, globalIgnores } from "eslint/config";
import baseConfig from "@__APP_NAME__/config/eslint";
import globals from "globals";

export default defineConfig([
  ...baseConfig,
  globalIgnores(["convex/_generated"]),
  { languageOptions: { globals: globals.node } },
]);
