/**
 * Build script: compiles src/styles/globals.css → dist/globals.css
 * using the Tailwind CSS v4 CLI.
 *
 * Called automatically by `pnpm build` via the package.json script.
 */
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// scripts/ lives one level inside the package root
const root = dirname(__dirname);

mkdirSync(join(root, "dist"), { recursive: true });

execSync("npx @tailwindcss/cli -i ./src/styles/globals.css -o ./dist/globals.css --minify", {
  cwd: root,
  stdio: "inherit",
});

console.log("✅  globals.css compiled → dist/globals.css");
