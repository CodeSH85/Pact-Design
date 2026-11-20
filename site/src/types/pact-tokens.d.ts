declare module 'pact-design/utils/helper.js' {
  export function isFalsy(param: unknown): param is null | undefined
  export function clamp01(n: number): number
  export function round(n: number, d?: number): number
  export function kebab(s: string): string
  export function esc(s: string): string
  export function clone<T>(v: T): T
  export function same(a: unknown, b: unknown): boolean
}

declare module 'pact-design/utils/color.js' {
  import type { ColorObjectValue, RgbColor, TokenValue } from '../types/tokens'

  export function toColor(DTCGColorToken: unknown): unknown
  export function oklchToRgb(L: number, C: number, H: number): RgbColor & { inGamut: boolean }
  export function rgbToOklch(rgb: RgbColor): [number, number, number]
  export function hexToRgb(hex: string): (RgbColor & { a: number }) | null
  export function rgbToHex(rgb: RgbColor): string
  export function oklchToHex(L: number, C: number, H: number): string | null
  export function oklchToHex(coords: [number, number, number]): string | null
  export function hexToOklch(hex: string): ColorObjectValue | string
  export function colorValueToRgb(value: unknown): (RgbColor & { a: number; inGamut: boolean }) | null
  export function colorValueToOklch(value: unknown): [number, number, number]
  export function colorValueToCss(value: TokenValue | unknown): string
  export function colorValueToHex(value: TokenValue | unknown): string
  export function getTokenColorString(value: unknown): string | null
}

declare module 'pact-design/utils/contrast.js' {
  import type { ContrastLevelInfo, TokenValue } from '../types/tokens'

  export { getTokenColorString } from 'pact-design/utils/color.js'
  export function calculateContrast(colorVal: TokenValue | unknown, backgroundVal?: TokenValue | unknown): number
  export const contrast: typeof calculateContrast
  export function wcagLevel(ratio: number): string
  export function calculateAPCA(textVal: TokenValue | unknown, backgroundVal?: TokenValue | unknown): number
  export const apcaContrast: typeof calculateAPCA
  export function apcaLevel(lc: number): ContrastLevelInfo
  export function readableOn(value: TokenValue | unknown): '#fff' | '#000'
  export function evaluateWCAG(
    colorVal: unknown,
    backgroundVal?: unknown,
    targetMinRatio?: number,
    targetMinLc?: number
  ): {
    lc: number
    absLc: number
    targetMinLc: number
    ratio: number
    targetMinRatio: number
    passesTarget: boolean
    passesAANormal: boolean
    passesAALarge: boolean
    passesAAANormal: boolean
    colorStr: unknown
    backgroundVal: unknown
  }
}

declare module 'pact-design/utils/token.js' {
  import type {
    CompositePropMeta,
    ResolvedTokenEntry,
    ThemeMode,
    Token,
    TokenFiles,
    TokenIssue,
    TokenValue
  } from '../types/tokens'

  export const REF_RE: RegExp
  export const CSS_VAR_PREFIX: string
  export const TYPOGRAPHY_PROPS: Record<string, CompositePropMeta>
  export const SHADOW_PROPS: Record<string, CompositePropMeta>

  export function isToken(node: unknown): boolean
  export function refOf(value: unknown): string | null
  export class TokenError extends Error {}
  export function orderedEntries<T>(obj: Record<string, T>): Array<[string, T]>
  export function stringifyTokens(value: unknown, indent?: string): string
  export function themeOf(file: string): ThemeMode | null
  export function levelOf(file: string): string | undefined
  export function fileStemOf(file: string): string
  export function categoryOf(file: string): string
  export function filterFilesForTheme(files: TokenFiles, theme?: ThemeMode): TokenFiles
  export function flatten(
    files: TokenFiles,
    theme?: ThemeMode | null
  ): { tokens: Map<string, Token>; issues: TokenIssue[] }
  export function resolveValue(
    value: TokenValue | unknown,
    tokens: Map<string, Token>,
    stack?: string[]
  ): TokenValue
  export function tryResolve(token: Token, tokens: Map<string, Token>): ResolvedTokenEntry
  export function collectRefs(value: unknown, out?: string[]): string[]
  export function dependsOn(
    candidateId: string,
    targetId: string,
    tokens: Map<string, Token>,
    seen?: Set<string>
  ): boolean
  export function buildUsage(tokens: Map<string, Token>): Map<string, string[]>
  export function cssName(path: string | string[]): string
  export function toPx(dim: unknown): number | null
  export function parseDimension(value: unknown): { value: number; unit: string }
  export function dimensionToCss(v: unknown): string
  export function fontFamilyToCss(v: unknown): string
  export function valueToCss(type: string | undefined, v: unknown): string | null
  export function formatValue(type: string | undefined, v: unknown): string
  export function buildCss(
    tokens: Map<string, Token>,
    darkTokens?: Map<string, Token> | null
  ): { css: string; errors: TokenIssue[] }
}
