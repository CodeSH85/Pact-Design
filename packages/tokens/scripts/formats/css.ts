import type { Dictionary, FormatFnArguments, TransformedToken } from 'style-dictionary/types'
import { createPropertyFormatter, fileHeader } from 'style-dictionary/utils'
import { dimensionToCss, refOf, SHADOW_PROPS, TYPOGRAPHY_PROPS } from '../../utils/token.js'
import { getTokenType, getTokenValue } from '../transforms/dtcg.ts'

interface CompositePropMeta {
  type: string
  css: string
  hint: string
}

/**
 * StyleDictionary's DTCG Types Map Util has some issue with some token types, we need to implement ourself
 * @link https://github.com/style-dictionary/style-dictionary/issues/1600
 */
const COMPOSITE_SUBPROPS: Record<string, Record<string, CompositePropMeta>> = {
  typography: TYPOGRAPHY_PROPS,
  shadow: SHADOW_PROPS
}

/**
 * Fix JS integer-key hoisting (e.g. "10" appearing before "01") when sibling
 * tokens share the same parent path and end with numeric scale keys.
 */
function sortNumericScales(tokens: TransformedToken[]): TransformedToken[] {
  return [...tokens].sort((a, b) => {
    if (a.path.length === b.path.length && a.path.length > 1) {
      const sameParent = a.path.slice(0, -1).every((seg, i) => seg === b.path[i])
      if (sameParent) {
        const aKey = a.path[a.path.length - 1]
        const bKey = b.path[b.path.length - 1]
        if (/^\d+$/.test(aKey) && /^\d+$/.test(bKey)) {
          return Number(aKey) - Number(bKey)
        }
      }
    }
    return 0
  })
}

function lookupRefToken(rawVal: unknown, dictionary: Dictionary): TransformedToken | null {
  const ref = refOf(rawVal)
  if (!ref) return null
  const found = ref.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, dictionary.tokens)
  return (found as TransformedToken | undefined) ?? null
}

export interface ExpandOptions {
  outputReferences?: boolean
  usesDtcg?: boolean
}

export function expandAndFormatTokens(
  dictionary: Dictionary,
  { outputReferences = true, usesDtcg = true }: ExpandOptions = {}
): string {
  const formatProperty = createPropertyFormatter({
    outputReferences,
    dictionary,
    format: 'css',
    usesDtcg
  })

  const sortedTokens = sortNumericScales(dictionary.allTokens)
  const lines: string[] = []

  for (const token of sortedTokens) {
    const type = getTokenType(token)
    const propsMap = type ? COMPOSITE_SUBPROPS[type] : undefined

    if (propsMap) {
      const origVal = usesDtcg ? token.original?.$value : token.original?.value
      const aliasTarget = lookupRefToken(origVal, dictionary)

      for (const [prop, meta] of Object.entries(propsMap)) {
        const subName = `${token.name}-${meta.css}`
        if (aliasTarget) {
          const targetVal = getTokenValue(aliasTarget) as Record<string, unknown> | undefined
          const refSubVal = outputReferences
            ? `var(--${aliasTarget.name}-${meta.css})`
            : dimensionToCss(targetVal?.[prop])
          lines.push(`  --${subName}: ${refSubVal};`)
          continue
        }

        const rawSub = (origVal as Record<string, unknown> | undefined)?.[prop]
        if (rawSub === undefined) continue

        const refTarget = lookupRefToken(rawSub, dictionary)
        const resolvedSub = refTarget ? getTokenValue(refTarget) : dimensionToCss(rawSub)

        lines.push(
          formatProperty({
            ...token,
            name: subName,
            path: [...token.path, meta.css],
            key: `{${[...token.path, meta.css].join('.')}}`,
            $type: meta.type,
            type: meta.type,
            $value: resolvedSub,
            value: resolvedSub,
            original: {
              ...token.original,
              $type: meta.type,
              type: meta.type,
              $value: rawSub,
              value: rawSub
            }
          })
        )
      }

      if (outputReferences) {
        const shorthand =
          type === 'typography'
            ? `var(--${token.name}-font-weight) var(--${token.name}-font-size)/var(--${token.name}-line-height) var(--${token.name}-font-family)`
            : `var(--${token.name}-offset-x) var(--${token.name}-offset-y) var(--${token.name}-blur) var(--${token.name}-spread) var(--${token.name}-color)`
        lines.push(`  --${token.name}: ${shorthand};`)
      } else {
        lines.push(`  --${token.name}: ${getTokenValue(token)};`)
      }
      continue
    }

    lines.push(formatProperty(token))
  }

  return lines.filter(Boolean).join('\n')
}

export async function formatThemedCss({ dictionary, file, options }: FormatFnArguments): Promise<string> {
  const header = await fileHeader({ file })
  const usesDtcg = options.usesDtcg ?? true
  const outputReferences = typeof options.outputReferences === 'boolean' ? options.outputReferences : true
  const lightVars = expandAndFormatTokens(dictionary, { outputReferences, usesDtcg })

  const darkDictionary = options.darkDictionary as Dictionary | undefined
  if (!darkDictionary) {
    throw new Error('css/variables-themed format requires `options.darkDictionary`')
  }

  const darkOnlyDict: Dictionary = {
    ...darkDictionary,
    allTokens: darkDictionary.allTokens.filter((t) => t.filePath.endsWith('.dark.json'))
  }
  const darkVars = expandAndFormatTokens(darkOnlyDict, { outputReferences, usesDtcg })

  return `${header}:root, [data-theme="light"] {\n${lightVars}\n}\n\n[data-theme="dark"] {\n${darkVars}\n}\n`
}
