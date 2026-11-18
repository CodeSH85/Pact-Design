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
import type { Token, TokenFiles, TokenGroupJson } from '../types/tokens'

const rawTokenModules = import.meta.glob<TokenGroupJson>('../../../packages/tokens/src/**/*.json', {
  eager: true,
  import: 'default'
})

export interface TokenCatalog {
  files: TokenFiles
  lightTokens: Map<string, Token>
  darkTokens: Map<string, Token>
}

let cachedData: TokenCatalog | null = null

export function loadTokenCatalog(): TokenCatalog {
  if (cachedData) return cachedData

  const files: TokenFiles = {}
  for (const [relPath, json] of Object.entries(rawTokenModules)) {
    const cleanKey = relPath.replace(/^.*\/src\/(.*)$/, 'src/$1')
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
