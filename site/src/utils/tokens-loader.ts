import { tokens } from '@pact-design/tokens/src/index.ts'
import {
  colorValueToCss,
  colorValueToHex,
  colorValueToOklch
} from '@pact-design/tokens/utils/color.js'
import {
  apcaLevel,
  calculateAPCA,
  calculateContrast,
  readableOn
} from '@pact-design/tokens/utils/contrast.js'
import { splitModes } from '@pact-design/tokens/utils/theme.js'
import {
  categoryOf,
  cssName,
  dimensionToCss,
  flatten,
  formatValue,
  refOf,
  resolveValue,
  toPx
} from '@pact-design/tokens/utils/token.js'
import type { Token, TokenFiles, TokenGroupJson } from '../types/tokens'

export interface TokenCatalog {
  files: TokenFiles
  lightTokens: Map<string, Token>
  darkTokens: Map<string, Token>
}

const DOMAIN_TO_CATEGORY: Record<string, string> = {
  color: 'color',
  opacity: 'opacity',
  font: 'typography',
  spacing: 'spacing',
  size: 'sizing',
  border: 'border',
  radius: 'border',
  elevation: 'elevation',
  motion: 'motion'
}

function groupDomainsByCategory(tierTree: Record<string, unknown>): Record<string, Record<string, unknown>> {
  const grouped: Record<string, Record<string, unknown>> = {}
  for (const [domain, value] of Object.entries(tierTree)) {
    const category = DOMAIN_TO_CATEGORY[domain] ?? domain
    grouped[category] ??= {}
    grouped[category][domain] = value
  }
  return grouped
}

let cachedData: TokenCatalog | null = null

export function loadTokenCatalog(): TokenCatalog {
  if (cachedData) return cachedData

  const files: TokenFiles = {}

  for (const [category, domains] of Object.entries(groupDomainsByCategory(tokens.pd.global))) {
    const { base, light, dark } = splitModes({ pd: { global: domains } })
    if (base) files[`tokens/global/${category}.json`] = base as TokenGroupJson
    if (light) files[`tokens/global/${category}.light.json`] = light as TokenGroupJson
    if (dark) files[`tokens/global/${category}.dark.json`] = dark as TokenGroupJson
  }

  for (const [category, domains] of Object.entries(groupDomainsByCategory(tokens.pd.system))) {
    const { base, light, dark } = splitModes({ pd: { system: domains } })
    if (base) files[`tokens/system/${category}.json`] = base as TokenGroupJson
    if (light) files[`tokens/system/${category}.light.json`] = light as TokenGroupJson
    if (dark) files[`tokens/system/${category}.dark.json`] = dark as TokenGroupJson
  }

  for (const [compName, compTree] of Object.entries(tokens.pd.component)) {
    const { base, light, dark } = splitModes({ pd: { component: { [compName]: compTree } } })
    if (base) files[`tokens/component/${compName}.json`] = base as TokenGroupJson
    if (light) files[`tokens/component/${compName}.light.json`] = light as TokenGroupJson
    if (dark) files[`tokens/component/${compName}.dark.json`] = dark as TokenGroupJson
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
  categoryOf,
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
