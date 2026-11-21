# @pact-design/styles

**Framework-agnostic CSS layers, scoped component stylesheets, Light/Dark `color-scheme` theming, and optional UnoCSS preset for Pact Design.**

---

## Overview

`@pact-design/styles` provides the web styling layer on top of [`@pact-design/tokens`](../tokens/README.md). It compiles framework-agnostic CSS layers (tokens, theme `color-scheme`, scoped `.pd-reset`, and semantic `.pd-*` component stylesheets via Lightning CSS) alongside an optional UnoCSS preset for application-level utility styling.

---

## Installation

```bash
pnpm add @pact-design/styles
```

> `@pact-design/tokens` is a dependency of `@pact-design/styles`, so installing `@pact-design/styles` is sufficient when consuming layered CSS, component stylesheets, or the UnoCSS preset.

---

## Usage

### 1. Self-Contained Layered CSS (`./css`)

Import `@pact-design/styles/css` once in your application entrypoint:

```css
/* Includes @layer pact.tokens, pact.theme, pact.reset, pact.components */
@import '@pact-design/styles/css';
```

Or in JavaScript/TypeScript:

```ts
import '@pact-design/styles/css'
```

Compiled cascade layer order:

```css
@layer pact.tokens, pact.theme, pact.reset, pact.components;
```

- **`pact.tokens`**: All `--pd-*` CSS custom properties for `:root, [data-theme="light"]` and `[data-theme="dark"]` (inlined from `@pact-design/tokens/css`).
- **`pact.theme`**: Sets `color-scheme: light` on `:root, [data-theme="light"]` and `color-scheme: dark` on `[data-theme="dark"]` so native scrollbars and browser controls automatically adapt to the active theme.
- **`pact.reset`**: Scoped `.pd-reset` rules neutralizing browser user-agent styles without polluting unclassed page elements.
- **`pact.components`**: Pre-compiled semantic `.pd-*` component stylesheets (`.pd-button`, `.pd-toggle-button`, etc.) using `:where()` modifiers so consumer styles override cleanly.

### 2. Granular Stylesheet Imports

Import individual layers or per-component stylesheets when you want fine-grained control:

```css
@import '@pact-design/styles/css/tokens';
@import '@pact-design/styles/css/theme';
@import '@pact-design/styles/css/reset';
@import '@pact-design/styles/css/components';

/* Or import a single component stylesheet */
@import '@pact-design/styles/css/components/button.css';
```

### 3. Optional UnoCSS / Tailwind Preset (`./uno`)

For apps that want to style their own layouts using Pact Design tokens via UnoCSS:

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

The `./uno` entrypoint also exports `pactTheme` (typed via `PactTheme`) and `pactThemeCss`.

---

## Package Structure & Exports

| Export | Subpath | Target | Description |
| :--- | :--- | :--- | :--- |
| `@pact-design/styles/css` | `./css` | `./build/css/index.css` | Self-contained CSS with `@layer pact.tokens, pact.theme, pact.reset, pact.components;` |
| `@pact-design/styles/css/tokens` | `./css/tokens` | `./build/css/tokens.css` | `--pd-*` custom properties only |
| `@pact-design/styles/css/theme` | `./css/theme` | `./build/css/theme.css` | Light/Dark `color-scheme` rules only |
| `@pact-design/styles/css/reset` | `./css/reset` | `./build/css/reset.css` | Scoped `.pd-reset` rules only |
| `@pact-design/styles/css/components` | `./css/components` | `./build/css/components.css` | All compiled component stylesheets |
| `@pact-design/styles/css/components/*` | `./css/components/*` | `./build/css/components/*.css` | Individual compiled component stylesheets |
| `@pact-design/styles/uno` | `./uno` | `./build/uno/preset.js` (+ `preset.d.ts`) | `pactPreset`, `pactTheme`, and `pactThemeCss` |

```txt
packages/styles/
├── src/
│   ├── css/
│   │   ├── theme.css          # Source Light/Dark color-scheme rules
│   │   └── reset.css          # Scoped .pd-reset rules
│   ├── components/
│   │   ├── index.css          # Component stylesheet barrel
│   │   ├── button.css         # .pd-button styles
│   │   └── toggle-button.css  # .pd-toggle-button & group styles
│   └── uno/
│       ├── preset.ts          # UnoCSS theme extractor & preset formatter
│       └── rules.ts           # Declarative token-path-to-UnoCSS slot rules
├── scripts/
│   └── build.ts               # Compiles CSS layers (Lightning CSS) & UnoCSS preset
├── test/
│   └── build-contract.test.js
└── build/                     # Generated artifacts (gitignored)
```

---

## Development

```bash
# Build CSS layers + component CSS + UnoCSS preset and run contract tests
pnpm --filter @pact-design/styles build

# Typecheck
pnpm --filter @pact-design/styles typecheck
```
