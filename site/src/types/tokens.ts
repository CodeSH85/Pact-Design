export type ThemeMode = 'light' | 'dark'

export type TokenType =
  | 'color'
  | 'dimension'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'fontWeight'
  | 'fontFamily'
  | 'strokeStyle'
  | 'typography'
  | 'shadow'

export type ContrastMode = 'lc-white' | 'lc-black' | 'wcag-white' | 'none'

export type TokenLevel = 'all' | 'global' | 'system' | 'component'

export interface ColorObjectValue {
  colorSpace: 'oklch' | 'srgb' | string
  components: [number, number, number]
  alpha?: number
  hex?: string
}

export type ColorTokenValue = string | ColorObjectValue

export interface DimensionObjectValue {
  value: number
  unit: string
}

export type DimensionTokenValue = string | DimensionObjectValue

export interface TypographyTokenValue {
  fontFamily?: string | string[]
  fontSize?: DimensionTokenValue | string
  fontWeight?: number | string
  lineHeight?: number | string
  letterSpacing?: DimensionTokenValue | string
  [key: string]: unknown
}

export interface ShadowTokenValue {
  offsetX?: DimensionTokenValue | string
  offsetY?: DimensionTokenValue | string
  blur?: DimensionTokenValue | string
  spread?: DimensionTokenValue | string
  color?: ColorTokenValue
  [key: string]: unknown
}

export type TokenValue =
  | string
  | number
  | number[]
  | string[]
  | ColorObjectValue
  | DimensionObjectValue
  | TypographyTokenValue
  | ShadowTokenValue

export interface TokenNode {
  $value: TokenValue
  $type?: TokenType | string
  $description?: string
  [key: string]: unknown
}

export interface TokenGroupJson {
  [key: string]: TokenGroupJson | TokenNode | string | unknown
}

export type TokenFiles = Record<string, TokenGroupJson>

export interface Token {
  id: string
  path: string[]
  file: string
  node: TokenNode
  type?: string
}

export interface TokenIssue {
  id: string
  file: string
  message: string
}

export interface ResolvedTokenEntry {
  value?: TokenValue
  error?: string
}

export interface CompositePropMeta {
  type: TokenType | string
  css: string
  hint?: string
}

export interface ContrastLevelInfo {
  tier: string
  usage: string
  css: string
}

export interface RgbColor {
  r: number
  g: number
  b: number
  a?: number
  inGamut?: boolean
}
