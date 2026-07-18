/**
 * Build script: compiles src/styles/index.css → dist/styles.css using
 * the Tailwind CSS v4 CLI. Called by `pnpm run build:css`.
 */
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);

mkdirSync(join(root, "dist"), { recursive: true });

execSync(
  `npx @tailwindcss/cli -i ./src/styles/index.css -o ./dist/styles.css --minify`,
  { cwd: root, stdio: "inherit" }
);

console.log("✅  styles.css built → dist/styles.css");
