/**
 * Pure theme-tree utilities for resolving `{ __themed: true, light, dark }` leaves.
 * Kept separate from `src/factory.ts` so token factories stay minimal and declarative.
 */

export function isThemedNode(node) {
  return !!node && typeof node === 'object' && node.__themed === true
}

export function isDtcgNode(node) {
  return !!node && typeof node === 'object' && !Array.isArray(node) && '$value' in node && '$type' in node
}

/**
 * Resolves a token tree for a single theme mode (`'light'` or `'dark'`),
 * replacing every themed leaf with its light or dark DTCG token.
 */
export function resolveTheme(tree, mode) {
  function walk(node) {
    if (isThemedNode(node)) {
      return mode === 'light' ? node.light : node.dark
    }
    if (isDtcgNode(node) || !node || typeof node !== 'object' || Array.isArray(node)) {
      return node
    }
    const out = {}
    for (const [k, v] of Object.entries(node)) {
      out[k] = walk(v)
    }
    return out
  }

  return walk(tree)
}

/**
 * Splits a token tree into separate `base` (non-themed), `light`, and `dark` DTCG trees.
 */
export function splitModes(tree) {
  function extract(node, mode) {
    if (isThemedNode(node)) {
      if (mode === 'base') return undefined
      return mode === 'light' ? node.light : node.dark
    }
    if (isDtcgNode(node)) {
      return mode === 'base' ? node : undefined
    }
    if (!node || typeof node !== 'object' || Array.isArray(node)) {
      return undefined
    }

    const out = {}
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
    base: extract(tree, 'base') ?? null,
    light: extract(tree, 'light') ?? null,
    dark: extract(tree, 'dark') ?? null
  }
}

/**
 * Collects the dot-paths of every themed leaf across `tree` so the CSS formatter
 * can emit `[data-theme="dark"]` overrides cleanly.
 */
export function collectThemedPaths(tree) {
  const paths = new Set()
  function walk(node, trail) {
    if (isThemedNode(node)) {
      paths.add(trail.join('.'))
      return
    }
    if (isDtcgNode(node) || !node || typeof node !== 'object' || Array.isArray(node)) {
      return
    }
    for (const [k, v] of Object.entries(node)) {
      walk(v, [...trail, k])
    }
  }
  walk(tree, [])
  return paths
}
