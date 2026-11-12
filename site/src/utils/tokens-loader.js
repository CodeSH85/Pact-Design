import {
  colorValueToCss,
  colorValueToHex,
  colorValueToOklch
} from 'pact-design/utils/color.js'
import {
  apcaLevel,
  calculateAPCA,
  calculateContrast,
  readableOn
} from 'pact-design/utils/contrast.js'
import {
  cssName,
  dimensionToCss,
  flatten,
  formatValue,
  refOf,
  resolveValue,
  toPx
} from 'pact-design/utils/token.js'

const rawTokenModules = import.meta.glob('../../../packages/tokens/tokens/**/*.json', {
  eager: true,
  import: 'default'
})

let cachedData = null

export function loadTokenCatalog() {
  if (cachedData) return cachedData

  const files = {}
  for (const [relPath, json] of Object.entries(rawTokenModules)) {
    const cleanKey = relPath.replace(/^.*\/tokens\/(.*)$/, 'tokens/$1')
    files[cleanKey] = json
  }

  const light = flatten(files, 'light')
  const dark = flatten(files, 'dark')

  cachedData = {
    files,
    lightTokens: light.tokens,
    darkTokens: dark.tokens
  }
  return cachedData
}

export {
  apcaLevel,
  calculateAPCA,
  calculateContrast,
  colorValueToCss,
  colorValueToHex,
  colorValueToOklch,
  cssName,
  dimensionToCss,
  formatValue,
  readableOn,
  refOf,
  resolveValue,
  toPx
}
