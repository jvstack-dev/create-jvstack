import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  platform: "node",
  sourcemap: true,
  target: "node20",
  banner: { js: "#!/usr/bin/env node" },
});
