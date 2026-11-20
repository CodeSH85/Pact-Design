import type { DtcgToken, ThemedToken, TokenGroup } from './types.ts'

export function themed<T extends DtcgToken>(light: T, dark: T): ThemedToken<T> {
  return {
    __themed: true,
    light,
    dark
  }
}

export function isThemedToken(node: unknown): node is ThemedToken {
  return (
    !!node &&
    typeof node === 'object' &&
    '__themed' in node &&
    (node as ThemedToken).__themed === true
  )
}

export function isDtcgToken(node: unknown): node is DtcgToken {
  return (
    !!node &&
    typeof node === 'object' &&
    !Array.isArray(node) &&
    '$value' in node &&
    '$type' in node
  )
}

export interface SplitModesResult {
  base: Record<string, unknown> | null
  light: Record<string, unknown> | null
  dark: Record<string, unknown> | null
}

/**
 * Splits a token tree containing a mix of plain `DtcgToken`s and `ThemedToken`s
 * into separate `base` (non-themed), `light`, and `dark` DTCG JSON trees.
 */
export function splitModes(tree: TokenGroup): SplitModesResult {
  function extract(
    node: unknown,
    mode: 'base' | 'light' | 'dark'
  ): unknown {
    if (isThemedToken(node)) {
      if (mode === 'base') return undefined
      return mode === 'light' ? node.light : node.dark
    }
    if (isDtcgToken(node)) {
      return mode === 'base' ? node : undefined
    }
    if (!node || typeof node !== 'object' || Array.isArray(node)) {
      return undefined
    }

    const out: Record<string, unknown> = {}
    let hasEntries = false
    for (const [k, v] of Object.entries(node)) {
      const sub = extract(v, mode)
      if (sub !== undefined) {
        out[k] = sub
        hasEntries = true
      }
    }
    return hasEntries ? out : undefined
  }

  return {
    base: (extract(tree, 'base') as Record<string, unknown> | undefined) ?? null,
    light: (extract(tree, 'light') as Record<string, unknown> | undefined) ?? null,
    dark: (extract(tree, 'dark') as Record<string, unknown> | undefined) ?? null
  }
}
