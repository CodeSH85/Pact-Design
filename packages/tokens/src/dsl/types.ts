export type DtcgType =
  | 'color'
  | 'dimension'
  | 'duration'
  | 'fontFamily'
  | 'fontWeight'
  | 'number'
  | 'strokeStyle'
  | 'cubicBezier'
  | 'typography'
  | 'shadow'

export interface OklchColorValue {
  colorSpace: 'oklch'
  components: [number, number, number]
  alpha: number
  hex: string
}

export interface DimensionValue {
  value: number
  unit: 'px' | 'rem' | 'em'
}

export interface DurationValue {
  value: number
  unit: 'ms' | 's'
}

export interface TypographyValue {
  fontFamily: string
  fontSize: string
  fontWeight: string
  lineHeight: string
  letterSpacing: string
}

export interface ShadowValue {
  offsetX: string
  offsetY: string
  blur: string
  spread: string
  color: string
}

export interface DtcgToken<T extends DtcgType = DtcgType, V = unknown> {
  $value: V
  $type: T
  $description?: string
}

export interface ThemedToken<T extends DtcgToken = DtcgToken> {
  readonly __themed: true
  readonly light: T
  readonly dark: T
}

export type TokenLeaf = DtcgToken | ThemedToken

export interface TokenGroup {
  [key: string]: TokenLeaf | TokenGroup
}

/**
 * Extracts all leaf dot-paths from a nested token tree (including `ThemedToken` leaves).
 */
export type TokenPath<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends TokenLeaf
    ? `${Prefix}${K}`
    : T[K] extends Record<string, unknown>
      ? TokenPath<T[K], `${Prefix}${K}.`>
      : never
}[keyof T & string]

/**
 * Extracts only leaf dot-paths whose `$type` matches `TargetType`.
 */
export type TypedTokenPath<T, TargetType extends DtcgType, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends DtcgToken<TargetType, unknown>
    ? `${Prefix}${K}`
    : T[K] extends ThemedToken<DtcgToken<TargetType, unknown>>
      ? `${Prefix}${K}`
      : T[K] extends TokenLeaf
        ? never
        : T[K] extends Record<string, unknown>
          ? TypedTokenPath<T[K], TargetType, `${Prefix}${K}.`>
          : never
}[keyof T & string]
