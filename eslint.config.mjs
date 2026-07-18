import { baseConfig } from "@cognix/config/eslint/base";

/**
 * Root ESLint config. Individual apps and packages provide their own
 * `eslint.config.mjs`; this covers root-level scripts and config files.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    ignores: ["apps/**", "packages/**", "services/**", "agents/**"],
  },
  ...baseConfig,
];
