import { baseConfig } from "@cognix/config/eslint/base";

export default [
  ...baseConfig,
  {
    rules: {
      // Prisma client is a runtime global singleton on `globalThis`.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
