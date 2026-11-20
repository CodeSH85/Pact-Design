import type { Transform, TransformedToken } from 'style-dictionary/types'
import { colorValueToCss } from '../../utils/color.js'
import { dimensionToCss } from '../../utils/token.js'

export const getTokenType = (token: TransformedToken): string | undefined =>
  token.$type ?? token.type

export const getTokenValue = (token: TransformedToken): unknown =>
  token.$value ?? token.value

interface TypographyValue {
  fontWeight?: unknown
  fontSize?: unknown
  lineHeight?: unknown
  fontFamily?: unknown
}

/**
 * Only register transforms where Style Dictionary v5.5.0 lacks DTCG 2025.10
 * support or alters output fidelity:
 * 1. dtcg/color/oklch: Preserve exact OKLCH components (built-in `color/css` converts to sRGB hex; `color/oklch` forces fixed decimals).
 * 2. dtcg/duration/css: Format DTCG `{ value, unit }` duration objects (built-in `time/seconds` only handles legacy `$type: "time"` strings).
 * 3. dtcg/typography/css: Format CSS font shorthand without emitting warnings for `letterSpacing` (which is expanded into its own CSS variable).
 */
export const customTransforms: Record<string, Omit<Transform, 'name'>> = {
  'dtcg/color/oklch': {
    type: 'value',
    transitive: true,
    filter: (token) => getTokenType(token) === 'color',
    transform: (token) => colorValueToCss(getTokenValue(token))
  },
  'dtcg/duration/css': {
    type: 'value',
    transitive: true,
    filter: (token) => getTokenType(token) === 'duration',
    transform: (token) => dimensionToCss(getTokenValue(token))
  },
  'dtcg/typography/css': {
    type: 'value',
    transitive: true,
    filter: (token) => getTokenType(token) === 'typography',
    transform: (token) => {
      const val = getTokenValue(token) as TypographyValue | null
      if (!val || typeof val !== 'object') return val
      return `${val.fontWeight} ${dimensionToCss(val.fontSize)}/${val.lineHeight} ${val.fontFamily}`
    }
  }
}

export const cssTransformList: string[] = [
  'attribute/cti',
  'name/kebab',
  'size/rem',
  'fontFamily/css',
  'cubicBezier/css',
  'shadow/css/shorthand',
  'dtcg/color/oklch',
  'dtcg/duration/css',
  'dtcg/typography/css'
]
