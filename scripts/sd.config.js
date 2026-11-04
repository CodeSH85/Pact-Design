import StyleDictionary from 'style-dictionary'
import { createPropertyFormatter, fileHeader } from 'style-dictionary/utils'
import { colorValueToCss } from '../utils/color.js'
import { dimensionToCss, refOf, SHADOW_PROPS, TYPOGRAPHY_PROPS } from '../utils/token.js'

/**
 * StyleDictionary's DTCG Types Map Util has some issue with some token types, we need to implement ourself
 * @link https://github.com/style-dictionary/style-dictionary/issues/1600
 */
const COMPOSITE_SUBPROPS = {
  typography: TYPOGRAPHY_PROPS,
  shadow: SHADOW_PROPS
}

const getType = (token) => token.$type ?? token.type
const getVal = (token) => token.$value ?? token.value

/**
 * Only register transforms where Style Dictionary v5.5.0 lacks DTCG 2025.10
 * support or alters output fidelity:
 * 1. dtcg/color/oklch: Preserve exact OKLCH components (built-in `color/css` converts to sRGB hex; `color/oklch` forces fixed decimals).
 * 2. dtcg/duration/css: Format DTCG `{ value, unit }` duration objects (built-in `time/seconds` only handles legacy `$type: "time"` strings).
 * 3. dtcg/typography/css: Format CSS font shorthand without emitting warnings for `letterSpacing` (which is expanded into its own CSS variable).
 */
const customTransforms = {
  'dtcg/color/oklch': {
    type: 'value',
    transitive: true,
    filter: (token) => getType(token) === 'color',
    transform: (token) => colorValueToCss(getVal(token))
  },
  'dtcg/duration/css': {
    type: 'value',
    transitive: true,
    filter: (token) => getType(token) === 'duration',
    transform: (token) => dimensionToCss(getVal(token))
  },
  'dtcg/typography/css': {
    type: 'value',
    transitive: true,
    filter: (token) => getType(token) === 'typography',
    transform: (token) => {
      const val = getVal(token)
      if (!val || typeof val !== 'object') return val
      return `${val.fontWeight} ${dimensionToCss(val.fontSize)}/${val.lineHeight} ${val.fontFamily}`
    }
  }
}

const cssTransformList = [
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

/**
 * Fix JS integer-key hoisting (e.g. "10" appearing before "01") when sibling
 * tokens share the same parent path and end with numeric scale keys.
 */
function sortNumericScales(tokens) {
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

function lookupRefToken(rawVal, dictionary) {
  const ref = refOf(rawVal)
  if (!ref) return null
  return ref.split('.').reduce((acc, part) => acc?.[part], dictionary.tokens) ?? null
}

function expandAndFormatTokens(dictionary, { outputReferences = true, usesDtcg = true }) {
  const formatProperty = createPropertyFormatter({
    outputReferences,
    dictionary,
    format: 'css',
    usesDtcg
  })

  const sortedTokens = sortNumericScales(dictionary.allTokens)
  const lines = []

  for (const token of sortedTokens) {
    const type = getType(token)
    const propsMap = COMPOSITE_SUBPROPS[type]

    if (propsMap) {
      const origVal = usesDtcg ? token.original?.$value : token.original?.value
      const aliasTarget = lookupRefToken(origVal, dictionary)

      for (const [prop, meta] of Object.entries(propsMap)) {
        const subName = `${token.name}-${meta.css}`
        if (aliasTarget) {
          const refSubVal = outputReferences
            ? `var(--${aliasTarget.name}-${meta.css})`
            : dimensionToCss(getVal(aliasTarget)?.[prop])
          lines.push(`  --${subName}: ${refSubVal};`)
          continue
        }

        const rawSub = origVal?.[prop]
        if (rawSub === undefined) continue

        const refTarget = lookupRefToken(rawSub, dictionary)
        const resolvedSub = refTarget ? getVal(refTarget) : dimensionToCss(rawSub)

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
        lines.push(`  --${token.name}: ${getVal(token)};`)
      }
      continue
    }

    lines.push(formatProperty(token))
  }

  return lines.filter(Boolean).join('\n')
}

export default {
  usesDtcg: true,
  source: ['tokens/**/!(*.dark).json'],
  platforms: {
    css: {
      transforms: cssTransformList,
      buildPath: 'build/css/',
      files: [
        {
          destination: '_variables.css',
          format: 'css/variables-themed',
          options: {
            outputReferences: true
          }
        }
      ]
    }
  },
  hooks: {
    transforms: customTransforms,
    formats: {
      'css/variables-themed': async({ dictionary, file, options }) => {
        const header = await fileHeader({ file })
        const usesDtcg = options.usesDtcg ?? true
        const outputReferences = options.outputReferences ?? true
        const lightVars = expandAndFormatTokens(dictionary, { outputReferences, usesDtcg })

        const darkSd = new StyleDictionary({
          usesDtcg: true,
          source: ['tokens/**/!(*.light).json'],
          hooks: { transforms: customTransforms },
          platforms: {
            css: {
              transforms: cssTransformList
            }
          }
        })
        const darkDict = await darkSd.getPlatformTokens('css')
        const darkOnlyDict = {
          ...darkDict,
          allTokens: darkDict.allTokens.filter((t) => t.filePath.endsWith('.dark.json'))
        }
        const darkVars = expandAndFormatTokens(darkOnlyDict, { outputReferences, usesDtcg })

        return `${header}:root, [data-theme="light"] {\n${lightVars}\n}\n\n[data-theme="dark"] {\n${darkVars}\n}\n`
      }
    }
  }
}
