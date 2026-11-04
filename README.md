# Pact Design

**Pact Design** is a domain-neutral design token system engineered for **dense, compact, and straightforward** user interfaces.

Built strictly on the **W3C Design Tokens Community Group (DTCG) 2025.10** specification, Pact Design prioritizes high information density, crisp structural hierarchy, and perceptual contrast precision—without unnecessary whitespace, decorative visual noise, or flashy animations.

---

## Design Philosophy

- **Dense & Compact**: Engineered around compact sizing and tight spatial rhythm (`24px`–`28px` compact controls, `0px`–`4px` sharp corner radii) to maximize information visibility in data-heavy workspaces, tables, and multi-pane layouts.
- **Straightforward & Functional**: Every token serves a clear structural or interactive purpose. Motion is strictly functional (`0ms`–`200ms` with linear and standard easing curves—no bouncy spring overshoot or decorative flourishes).
- **Domain-Neutral**: Designed as a general-purpose foundation that adapts cleanly to any professional web application without domain-specific coupling.

---

## Key Features

- **W3C DTCG 2025.10 Compliant**: Uses structured `$value` and `$type` schemas (`color`, `dimension`, `duration`, `cubicBezier`, `typography`, `shadow`) across 7 categories (`color`, `typography`, `spacing`, `sizing`, `border`, `elevation`, `motion`).
- **3-Tier Token Hierarchy**:
  - **`global`**: Raw primitives (11-step OKLCH color palettes `50`–`1000`, modular spacing/sizing scales, typographic primitives).
  - **`system`**: Semantic and theme-aware tokens (`light` & `dark` modes) for surfaces, text, borders, interactive states, focus rings, and elevation.
  - **`component`** *(planned)*: Scoped tokens for compact UI primitives.
- **Perceptually Uniform Color & APCA Contrast**:
  - Global palettes are authored in **OKLCH** with synchronized lightness steps (`500` anchored at `L = 0.600`).
  - Audited against **APCA (Accessible Perceptual Contrast Algorithm, WCAG 3.0 candidate)** as the primary readability metric across both Light and Dark themes.
- **Precision Typography**: Pairs proportional sans-serif scales (`tabular-nums` ready for numeric alignment) with dedicated monospace tokens (`system.font.mono.*`) for technical identifiers, hashes, and version tags.

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Build CSS Custom Properties (build/css/_variables.css) and run automated tests
pnpm build:sd

# Run CSS variable & APCA/WCAG contrast test suite directly
pnpm test

# Launch the interactive Token Playground (http://localhost:5173)
pnpm playground
```

---

## Documentation

- [**Design Token Architecture (`docs/token.md`)**](./docs/token.md) — Detailed specification of token tiers, naming conventions, OKLCH color scales, and CSS variable output.
- [**Roadmap (`docs/roadmap.md`)**](./docs/roadmap.md) — Completed milestones and upcoming plans.
