import path from "node:path";
import fs from "node:fs";

export default {
  "*.{ts,tsx,js,jsx,mjs,cjs}": (files) => {
    const existingFiles = files.filter((f) => fs.existsSync(f));
    if (existingFiles.length === 0) return [];

    const commands = [];

    // Group files by their closest eslint.config.mjs
    const groups = {};
    for (const file of existingFiles) {
      let dir = path.dirname(file);
      let configDir = process.cwd(); // default to root config

      // Traverse up to the repository root
      while (dir.startsWith(process.cwd()) && dir !== process.cwd()) {
        if (fs.existsSync(path.join(dir, "eslint.config.mjs"))) {
          configDir = dir;
          break;
        }
        dir = path.dirname(dir);
      }

      if (!groups[configDir]) groups[configDir] = [];
      groups[configDir].push(file);
    }

    for (const [dir, groupedFiles] of Object.entries(groups)) {
      const relativeFiles = groupedFiles.map((f) => path.relative(dir, f)).map((f) => `"${f}"`);

      if (dir === process.cwd()) {
        commands.push(`eslint --fix --max-warnings=0 --no-warn-ignored ${relativeFiles.join(" ")}`);
      } else {
        const relativeDir = path.relative(process.cwd(), dir);
        commands.push(
          `pnpm --dir "${relativeDir}" exec eslint --fix --max-warnings=0 --no-warn-ignored ${relativeFiles.join(" ")}`,
        );
      }
    }

    commands.push(
      `prettier --write ${existingFiles.map((f) => `"${path.relative(process.cwd(), f)}"`).join(" ")}`,
    );
    return commands;
  },
  "*.{json,md,yml,yaml,css}": (files) => {
    const existingFiles = files.filter((f) => fs.existsSync(f));
    if (existingFiles.length === 0) return [];
    return [`prettier --write ${existingFiles.map((f) => `"${f}"`).join(" ")}`];
  },
  "apps/api/**/*.py": (files) => {
    const existingFiles = files.filter((f) => fs.existsSync(f));
    if (existingFiles.length === 0) return [];
    return [
      `ruff check --fix ${existingFiles.map((f) => `"${f}"`).join(" ")}`,
      `ruff format ${existingFiles.map((f) => `"${f}"`).join(" ")}`,
    ];
  },
};
