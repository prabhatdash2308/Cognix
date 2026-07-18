# @cognix/design-system

The foundational design system for Cognix.

Built on React, Tailwind CSS v4, and Radix UI primitives.

## Features

- **CSS-First Design Tokens:** Built entirely using Tailwind v4 `@theme` block.
- **Accessible Primitives:** Fully typed React components built on top of Radix UI.
- **Premium Aesthetics:** Dark mode first, fluid animations, dynamic interactions.

## Installation

```bash
pnpm add @cognix/design-system
```

## Setup

Apps consuming the design system must import the CSS exactly once in their root entrypoint:

```tsx
// e.g. App.tsx or layout.tsx
import "@cognix/design-system/styles";
```

## Usage

```tsx
import { Button, Modal } from "@cognix/design-system";

export function App() {
  return (
    <Modal trigger={<Button>Open Settings</Button>} title="Settings">
      <p>Configure your preferences.</p>
    </Modal>
  );
}
```

## Design Tokens Reference

The design system exports standard semantic tokens for colors, typography, sizing, and shadows.

### Colors (Oklch)

- **Brand:** `--color-brand-50` to `--color-brand-950`
- **Neutral:** `--color-neutral-0` to `--color-neutral-1000`
- **Semantic:** `--color-bg-base`, `--color-surface`, `--color-text-primary`, `--color-border`, etc.

### Typography (Inter & JetBrains Mono)

- **Sizes:** `--text-2xs` to `--text-5xl`
- **Weights:** `--font-weight-regular` to `--font-weight-extrabold`

### Motion

- **Durations:** `--duration-fast` (100ms), `--duration-normal` (200ms), `--duration-slow` (350ms)
- **Eases:** `--ease-spring`, `--ease-out`, `--ease-in-out`
