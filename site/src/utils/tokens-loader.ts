import { splitModes, tokenModules } from '@pact-design/tokens/src/index.ts'
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

export interface TokenCatalog {
  files: TokenFiles
  lightTokens: Map<string, Token>
  darkTokens: Map<string, Token>
}

let cachedData: TokenCatalog | null = null

export function loadTokenCatalog(): TokenCatalog {
  if (cachedData) return cachedData

  const files: TokenFiles = {}
  for (const [moduleKey, tree] of Object.entries(tokenModules)) {
    const { base, light, dark } = splitModes(tree)
    if (base) files[`tokens/${moduleKey}.json`] = base as TokenGroupJson
    if (light) files[`tokens/${moduleKey}.light.json`] = light as TokenGroupJson
    if (dark) files[`tokens/${moduleKey}.dark.json`] = dark as TokenGroupJson
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
