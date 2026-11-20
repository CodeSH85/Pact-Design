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

export type ThemeMode = 'light' | 'dark'

/**
 * Resolves a token tree for a single theme mode, turning every `ThemedToken`
 * into its `light` or `dark` `DtcgToken` leaf.
 */
export function resolveModeTree(node: unknown, mode: ThemeMode): Record<string, unknown> {
  function walk(value: unknown): unknown {
    if (isThemedToken(value)) {
      return mode === 'light' ? value.light : value.dark
    }
    if (isDtcgToken(value)) {
      return value
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return value
    }
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = walk(v)
    }
    return out
  }

  return walk(node) as Record<string, unknown>
}

function deepMergeTokenTrees(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  for (const [k, v] of Object.entries(source)) {
    const existing = target[k]
    if (
      existing &&
      typeof existing === 'object' &&
      !Array.isArray(existing) &&
      !isDtcgToken(existing) &&
      v &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      !isDtcgToken(v)
    ) {
      deepMergeTokenTrees(
        existing as Record<string, unknown>,
        v as Record<string, unknown>
      )
    } else {
      target[k] = v
    }
  }
  return target
}

/**
 * Assembles all token modules into a single in-memory W3C DTCG token tree for
 * the given theme mode (`'light'` or `'dark'`), ready for Style Dictionary.
 */
export function assembleTokens(
  modules: Record<string, TokenGroup>,
  mode: ThemeMode
): Record<string, unknown> {
  const merged: Record<string, unknown> = {}
  for (const tree of Object.values(modules)) {
    deepMergeTokenTrees(merged, resolveModeTree(tree, mode))
  }
  return merged
}

/**
 * Collects the dot-paths of all `ThemedToken` leaves across `modules` so CSS
 * output can emit `[data-theme="dark"]` overrides without relying on filenames.
 */
export function collectThemedPaths(modules: Record<string, TokenGroup>): Set<string> {
  const paths = new Set<string>()
  function walk(node: unknown, trail: string[]): void {
    if (isThemedToken(node)) {
      paths.add(trail.join('.'))
      return
    }
    if (isDtcgToken(node) || !node || typeof node !== 'object' || Array.isArray(node)) {
      return
    }
    for (const [k, v] of Object.entries(node)) {
      walk(v, [...trail, k])
    }
  }
  for (const tree of Object.values(modules)) {
    walk(tree, [])
  }
  return paths
}
