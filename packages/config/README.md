# @cognix/config

Shared build, lint, format, and TypeScript configuration for the Cognix monorepo.

## Exports

| Import                                       | Purpose                                          |
| -------------------------------------------- | ------------------------------------------------ |
| `@cognix/config/tsconfig/base.json`          | Strict TypeScript base for Node/library packages |
| `@cognix/config/tsconfig/react-library.json` | TypeScript base for React component libraries    |
| `@cognix/config/tsconfig/nextjs.json`        | TypeScript base for Next.js apps                 |
| `@cognix/config/eslint/base`                 | ESLint flat config for TypeScript packages       |
| `@cognix/config/eslint/react`                | ESLint flat config for React libraries           |
| `@cognix/config/eslint/next`                 | ESLint flat config for Next.js apps              |
| `@cognix/config/prettier`                    | Shared Prettier config                           |

## Usage

`eslint.config.mjs`

```js
import { baseConfig } from "@cognix/config/eslint/base";
export default baseConfig;
```

`tsconfig.json`

```json
{ "extends": "@cognix/config/tsconfig/base.json" }
```
