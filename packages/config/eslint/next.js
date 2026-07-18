import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

/**
 * ESLint flat config for Next.js applications.
 *
 * Next.js ships its own parser, so we avoid the shared TypeScript base config
 * here — those rules require type-aware parser options that conflict with
 * `eslint-config-next`.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextConfig = [
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  prettier,
];

export default nextConfig;
