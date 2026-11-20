import type { FormatFnArguments, TransformedToken } from 'style-dictionary/types'
import { fileHeader } from 'style-dictionary/utils'
import type { PactExtension, PactUnoRule, UnoSlot } from '../../src/dsl/types.ts'
import { kebab } from '../../utils/helper.js'

export type FontSizeValue = string | [string, Record<string, string>]

export interface UnoTheme {
  colors: Record<string, string>
  spacing: Record<string, string>
  width: Record<string, string>
  height: Record<string, string>
  minWidth: Record<string, string>
  maxWidth: Record<string, string>
  minHeight: Record<string, string>
  maxHeight: Record<string, string>
  borderRadius: Record<string, string>
  borderWidth: Record<string, string>
  lineWidth: Record<string, string>
  ringWidth: Record<string, string>
  boxShadow: Record<string, string>
  zIndex: Record<string, string>
  fontFamily: Record<string, string>
  fontSize: Record<string, FontSizeValue>
  fontWeight: Record<string, string>
  lineHeight: Record<string, string>
  letterSpacing: Record<string, string>
  duration: Record<string, string>
  easing: Record<string, string>
}

function createEmptyTheme(): UnoTheme {
  return {
    colors: {},
    spacing: {},
    width: {},
    height: {},
    minWidth: {},
    maxWidth: {},
    minHeight: {},
    maxHeight: {},
    borderRadius: {},
    borderWidth: {},
    lineWidth: {},
    ringWidth: {},
    boxShadow: {},
    zIndex: {},
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
    duration: {},
    easing: {}
  }
}

function resolveBaseKey(path: string[], keyFrom: PactUnoRule['keyFrom'] = 'category'): string {
  const [, category, ...rest] = path
  switch (keyFrom) {
    case 'self':
      return category
    case 'category':
      return rest.join('-')
    case 'category-sub':
      return rest.slice(1).join('-')
    case 'scale-kebab':
      return `${kebab(category)}-${rest.join('-')}`
    case 'tier':
      return `${category}-${rest.join('-')}`
  }
}

function resolveKeys(path: string[], rule: PactUnoRule): string[] {
  const [, category, ...rest] = path
  const baseKey = resolveBaseKey(path, rule.keyFrom)
  const primary = `${rule.prefix ?? ''}${baseKey}`
  const keys: string[] = [primary]

  if (rule.stripSegment) {
    const stripList = Array.isArray(rule.stripSegment) ? rule.stripSegment : [rule.stripSegment]
    const stripped = `${category}-${rest.filter((seg) => !stripList.includes(seg)).join('-')}`
    keys.push(stripped)
    if (rule.defaultAlias === 'strip' && stripped.endsWith('-default')) {
      keys.push(stripped.replace(/-default$/, ''))
    }
  } else if (rule.defaultAlias === 'strip' && primary.endsWith('-default')) {
    keys.push(primary.replace(/-default$/, ''))
  }

  if (rule.defaultFor && baseKey === rule.defaultFor) {
    keys.push('DEFAULT')
  }

  if (rule.extraKeyFrom === 'category') {
    keys.push(category)
  }

  if (rule.extraKeys) {
    keys.push(...rule.extraKeys)
  }

  return keys
}

function getPactExtension(token: TransformedToken): PactExtension | undefined {
  const ext = (token.$extensions ?? token.original?.$extensions) as
    | { pact?: PactExtension }
    | undefined
  return ext?.pact
}

/**
 * Data-driven UnoCSS / Tailwind theme extractor.
 * Reads `$extensions.pact.uno` stamped by the TypeScript token DSL and fails
 * fast if any token is missing classification.
 */
export function extractUnoTheme(allTokens: TransformedToken[]): UnoTheme {
  const theme = createEmptyTheme()
  const unclassified: string[] = []

  for (const token of allTokens) {
    const pact = getPactExtension(token)
    if (pact?.uno === undefined) {
      unclassified.push(token.path.join('.'))
      continue
    }
    if (pact.uno === false) continue

    const rules = Array.isArray(pact.uno) ? pact.uno : [pact.uno]

    for (const rule of rules) {
      const keys = resolveKeys(token.path, rule)
      const value: FontSizeValue = rule.typographyTuple
        ? [
          `var(--${token.name}-font-size)`,
          {
            'line-height': `var(--${token.name}-line-height)`,
            'letter-spacing': `var(--${token.name}-letter-spacing)`,
            'font-weight': `var(--${token.name}-font-weight)`,
            'font-family': `var(--${token.name}-font-family)`
          }
        ]
        : `var(--${token.name})`

      for (const slot of rule.slots as UnoSlot[]) {
        const bucket = theme[slot] as Record<string, FontSizeValue>
        for (const key of keys) {
          bucket[key] = value
        }
      }
    }
  }

  if (unclassified.length > 0) {
    throw new Error(
      `Unclassified tokens missing $extensions.pact.uno:\n  - ${unclassified.join('\n  - ')}`
    )
  }

  return theme
}

export async function formatUnoPreset({ dictionary, file }: FormatFnArguments): Promise<string> {
  const header = await fileHeader({ file })
  const dynamicTheme = extractUnoTheme(dictionary.allTokens)

  return `${header}
  /**
   * Pact Design Token Preset for UnoCSS & Tailwind CSS
   * Dynamically generated from TypeScript token definitions.
   * Maps semantic tokens directly to CSS Custom Properties (var(--*)).
   */
  export const pactTheme = ${JSON.stringify(dynamicTheme, null, 2)}

  export function pactPreset() {
    return {
      name: 'pact-design',
      theme: pactTheme
    }
  }

  export default pactPreset
  `
}

export async function formatUnoTypes({ file }: FormatFnArguments): Promise<string> {
  const header = await fileHeader({ file })

  return `${header}export type PactFontSizeValue = string | [string, Record<string, string>]

export interface PactTheme {
  colors: Record<string, string>
  spacing: Record<string, string>
  width: Record<string, string>
  height: Record<string, string>
  minWidth: Record<string, string>
  maxWidth: Record<string, string>
  minHeight: Record<string, string>
  maxHeight: Record<string, string>
  borderRadius: Record<string, string>
  borderWidth: Record<string, string>
  lineWidth: Record<string, string>
  ringWidth: Record<string, string>
  boxShadow: Record<string, string>
  zIndex: Record<string, string>
  fontFamily: Record<string, string>
  fontSize: Record<string, PactFontSizeValue>
  fontWeight: Record<string, string>
  lineHeight: Record<string, string>
  letterSpacing: Record<string, string>
  duration: Record<string, string>
  easing: Record<string, string>
}

export interface PactPreset {
  name: string
  theme: PactTheme
}

export declare const pactTheme: PactTheme
export declare function pactPreset(): PactPreset
export default pactPreset
`
}
