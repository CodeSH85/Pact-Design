# @pact-design/tokens

**W3C DTCG 2025.10 design token compiler, raw CSS custom properties, metadata manifest, and isomorphic color/contrast utilities for Pact Design.**

---

## Overview

`@pact-design/tokens` is the framework-agnostic, bundler-agnostic foundation of Pact Design. It authors 3-tier tokens (`global`, `system`, `component`) in a strongly typed TypeScript DSL, compiles them with Style Dictionary v5 into `--pd-*` CSS custom properties and a token metadata manifest, and enforces automated APCA/WCAG perceptual contrast gates on every build.

For web styling layers (`@layer pact.tokens, pact.theme;`, `color-scheme`, and the UnoCSS preset), see [`@pact-design/styles`](../styles/README.md).

---

## Installation

```bash
pnpm add @pact-design/tokens
```

---

## Package Exports

| Export | Target | Description |
| :--- | :--- | :--- |
| `@pact-design/tokens/css` | `./build/css/_variables.css` | Raw `--pd-*` CSS custom properties (`:root, [data-theme="light"]` and `[data-theme="dark"]`) |
| `@pact-design/tokens/meta` | `./build/meta/tokens.json` | Flat token metadata manifest (`{ name, path, $type }[]`) |
| `@pact-design/tokens/src/*` | `./src/*` | TypeScript DSL primitives (`dsl/`) and `global` / `system` / `component` token definitions |
| `@pact-design/tokens/utils/*` | `./utils/*` | Isomorphic color (`color.js`), APCA/WCAG contrast (`contrast.js`), token (`token.js`), and string (`helper.js`) utilities |

### Examples

```css
/* Raw CSS custom properties only */
@import '@pact-design/tokens/css';
```

```ts
import { tokenModules } from '@pact-design/tokens/src/index.ts'
import { colorValueToCss, oklchToRgb } from '@pact-design/tokens/utils/color.js'
import { calculateAPCA } from '@pact-design/tokens/utils/contrast.js'
```

---

## Package Structure

```txt
packages/tokens/
├── src/
│   ├── dsl/                 # TypeScript DTCG token DSL, refs, and themed(light, dark)
│   ├── global/              # Raw primitives (OKLCH palettes, scales, motion, elevation)
│   ├── system/              # Semantic Light/Dark themeable roles
│   ├── component/           # Scoped component tokens
│   └── index.ts             # Token module registry
├── scripts/
│   ├── build.ts             # Node 22 native TS build runner
│   ├── sd.config.ts         # Style Dictionary v5 Light/Dark configs
│   ├── transforms/dtcg.ts   # Custom DTCG transforms (OKLCH, etc.)
│   └── formats/             # css.ts (_variables.css) and meta.ts (tokens.json)
├── utils/                   # Isomorphic color, contrast, token, and helper modules
├── test/                    # Automated build-contract and APCA/WCAG contrast tests
└── build/                   # Generated CSS & metadata outputs (gitignored)
```

---

## Development

```bash
# Build CSS variables + metadata manifest and run contrast/contract tests
pnpm --filter @pact-design/tokens build

# Typecheck
pnpm --filter @pact-design/tokens typecheck
```
