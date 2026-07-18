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
  // CSS is compiled separately via scripts/build-css.mjs
  injectStyle: false,
});
