/**
 * Commitlint configuration — enforces Conventional Commits.
 * @see https://www.conventionalcommits.org
 * @type {import("@commitlint/types").UserConfig}
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
    "scope-enum": [
      2,
      "always",
      [
        "web",
        "api",
        "gateway",
        "desktop",
        "mobile",
        "ui",
        "config",
        "types",
        "database",
        "auth",
        "ai",
        "sdk",
        "ci",
        "deps",
        "repo",
      ],
    ],
    "scope-empty": [0],
    "subject-case": [2, "never", ["upper-case", "pascal-case", "start-case"]],
  },
};
