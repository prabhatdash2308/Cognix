import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: {
    compilerOptions: {
      incremental: false,
    },
  },
  clean: true,
  sourcemap: true,
  treeshake: true,
  target: "es2022",
  external: ["react", "react-dom"],
  // CSS is handled separately via build:css script
  injectStyle: false,
});
