# @pact-design/styles

**Framework-agnostic CSS layers, Light/Dark `color-scheme` theming, and UnoCSS preset for Pact Design.**

---

## Overview

`@pact-design/styles` provides the web styling layer on top of [`@pact-design/tokens`](../tokens/README.md). It decouples web-specific CSS cascade layers, native browser `color-scheme` rules (for automatic Light/Dark scrollbars and form controls), and UnoCSS/Tailwind theme utilities from the core DTCG token compiler.

---

## Installation

```bash
pnpm add @pact-design/styles
```

> `@pact-design/tokens` is a dependency of `@pact-design/styles`, so installing `@pact-design/styles` is sufficient when consuming layered CSS or the UnoCSS preset.

---

## Usage

### 1. Self-Contained Layered CSS (`./css`)

Import `@pact-design/styles/css` once in your application entrypoint:

```css
/* Includes @layer pact.tokens (--pd-* variables) and @layer pact.theme (color-scheme) */
@import '@pact-design/styles/css';
```

Or in JavaScript/TypeScript:

```ts
import '@pact-design/styles/css'
```

Compiled cascade layer order:

```css
@layer pact.tokens, pact.theme;
```

- **`pact.tokens`**: All `--pd-*` CSS custom properties for `:root, [data-theme="light"]` and `[data-theme="dark"]` (inlined from `@pact-design/tokens/css`).
- **`pact.theme`**: Sets `color-scheme: light` on `:root, [data-theme="light"]` and `color-scheme: dark` on `[data-theme="dark"]` so native scrollbars and browser controls automatically adapt to the active theme.

### 2. Theme `color-scheme` Rules Only (`./css/theme`)

If you already load `@pact-design/tokens/css` directly or compile your own token CSS, import only the theme stylesheet:

```css
@import '@pact-design/styles/css/theme';
```

### 3. UnoCSS / Tailwind Preset (`./uno`)

```ts
// uno.config.ts
import { defineConfig, presetWind3 } from 'unocss'
import { pactPreset } from '@pact-design/styles/uno'

export default defineConfig({
  presets: [
    presetWind3(),
    pactPreset()
  ]
})
```

#### Opt-In `color-scheme` Preflight

When using UnoCSS **without** importing `@pact-design/styles/css` (or `@pact-design/styles/css/theme`), opt in to injecting the theme `color-scheme` preflight via UnoCSS:

```ts
pactPreset({ preflights: true })
```

`preflights` defaults to `false` so `@layer pact.theme` rules are not duplicated when `@pact-design/styles/css` is imported.

The `./uno` entrypoint also exports `pactTheme` (typed via `PactTheme` for `tailwind-merge` or custom theme integrations) and `pactThemeCss`.

---

## Package Structure & Exports

| Export | Subpath | Target | Description |
| :--- | :--- | :--- | :--- |
| `@pact-design/styles/css` | `./css` | `./build/css/index.css` | Self-contained CSS with `@layer pact.tokens, pact.theme;` |
| `@pact-design/styles/css/theme` | `./css/theme` | `./build/css/theme.css` | Light/Dark `color-scheme` rules only |
| `@pact-design/styles/uno` | `./uno` | `./build/uno/preset.js` (+ `preset.d.ts`) | `pactPreset`, `pactTheme`, and `pactThemeCss` |

```txt
packages/styles/
├── src/
│   ├── css/theme.css        # Source Light/Dark color-scheme rules
│   └── uno/
│       ├── preset.ts        # UnoCSS theme extractor & preset formatter
│       └── rules.ts         # Declarative token-path-to-UnoCSS slot rules
├── scripts/
│   └── build.ts             # Generates build/css/* and build/uno/*
├── test/
│   └── build-contract.test.js
└── build/                   # Generated artifacts (gitignored)
```

---

## Development

```bash
# Build CSS layers + UnoCSS preset and run contract tests
pnpm --filter @pact-design/styles build

# Typecheck
pnpm --filter @pact-design/styles typecheck
```
