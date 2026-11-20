import { isDtcgToken, isThemedToken } from './themed.ts'
import type { DtcgToken, PactExtension, PactUnoRule, ThemedToken } from './types.ts'

function attachToToken<T extends DtcgToken>(token: T, uno: PactExtension['uno']): T {
  return {
    ...token,
    $extensions: {
      ...token.$extensions,
      pact: {
        ...token.$extensions?.pact,
        uno
      }
    }
  }
}

/**
 * Recursively stamps `$extensions.pact.uno` onto every `DtcgToken` (and both
 * branches of every `ThemedToken`) in `node`, preserving exact TypeScript types.
 */
export function withUno<T>(uno: PactExtension['uno'], node: T): T {
  if (isThemedToken(node)) {
    return {
      __themed: true,
      light: attachToToken(node.light, uno),
      dark: attachToToken(node.dark, uno)
    } as ThemedToken as T
  }
  if (isDtcgToken(node)) {
    return attachToToken(node, uno) as T
  }
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(node)) {
      out[k] = withUno(uno, v)
    }
    return out as T
  }
  return node
}

/**
 * Marks a token or token group as internal-only (emitted to CSS variables,
 * intentionally omitted from the UnoCSS theme).
 */
export function internal<T>(node: T): T {
  return withUno(false, node)
}

/**
 * Semantic UnoCSS classification presets for component tokens.
 * Preserves 100% parity with existing `pactTheme` keys while eliminating path-guessing in `formats/uno.ts`.
 */
export const componentUno = {
  color: <T>(node: T): T =>
    withUno({ slots: ['colors'], keyFrom: 'tier', stripSegment: 'color', defaultAlias: 'strip' }, node),

  height: <T>(node: T): T =>
    withUno([
      { slots: ['height'], keyFrom: 'tier', stripSegment: 'height' },
      { slots: ['spacing'], keyFrom: 'tier' }
    ], node),

  maxHeight: <T>(node: T): T =>
    withUno({ slots: ['maxHeight'], keyFrom: 'tier', stripSegment: 'max-height' }, node),

  minHeight: <T>(node: T): T =>
    withUno({ slots: ['minHeight'], keyFrom: 'tier', stripSegment: 'min-height' }, node),

  width: <T>(node: T): T =>
    withUno([
      { slots: ['width'], keyFrom: 'tier', stripSegment: 'width' },
      { slots: ['spacing'], keyFrom: 'tier' }
    ], node),

  minWidth: <T>(node: T): T =>
    withUno({ slots: ['minWidth'], keyFrom: 'tier', stripSegment: 'min-width' }, node),

  maxWidth: <T>(node: T): T =>
    withUno({ slots: ['maxWidth'], keyFrom: 'tier', stripSegment: 'max-width' }, node),

  size: <T>(node: T): T =>
    withUno([
      { slots: ['width', 'height'], keyFrom: 'tier', stripSegment: ['size', 'icon-size'] },
      { slots: ['spacing'], keyFrom: 'tier' }
    ], node),

  radius: <T>(node: T): T =>
    withUno({ slots: ['borderRadius'], keyFrom: 'tier', stripSegment: 'radius' }, node),

  spacing: <T>(node: T): T =>
    withUno({ slots: ['spacing'], keyFrom: 'tier' }, node),

  zIndex: <T>(node: T): T =>
    withUno({ slots: ['zIndex'], keyFrom: 'tier', extraKeyFrom: 'category' }, node),

  shadow: <T>(node: T): T =>
    withUno([
      { slots: ['boxShadow'], keyFrom: 'tier' },
      { slots: ['boxShadow'], keyFrom: 'tier', prefix: 'elevation-' }
    ], node)
}

export type { PactUnoRule }
