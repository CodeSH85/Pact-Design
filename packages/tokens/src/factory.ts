import { oklchToHex } from '../utils/color.js'

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
 * Extracts all leaf dot-paths from a nested token tree (including `ThemedToken` and `$root` leaves).
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

export const oklch = (
  l: number,
  c: number,
  h: number,
  alpha = 1
): DtcgToken<'color', OklchColorValue> => ({
  $value: {
    colorSpace: 'oklch',
    components: [l, c, h],
    alpha,
    hex: oklchToHex(l, c, h) ?? '#000000'
  },
  $type: 'color'
})

export const colorLiteral = (value: string): DtcgToken<'color', string> => ({
  $value: value,
  $type: 'color'
})

export const px = (value: number): DtcgToken<'dimension', DimensionValue> => ({
  $value: { unit: 'px', value },
  $type: 'dimension'
})

export const rem = (value: number): DtcgToken<'dimension', DimensionValue> => ({
  $value: { unit: 'rem', value },
  $type: 'dimension'
})

export const ms = (value: number): DtcgToken<'duration', DurationValue> => ({
  $value: { unit: 'ms', value },
  $type: 'duration'
})

export const num = (value: number): DtcgToken<'number', number> => ({
  $value: value,
  $type: 'number'
})

export const strokeStyle = (value: string): DtcgToken<'strokeStyle', string> => ({
  $value: value,
  $type: 'strokeStyle'
})

export const cubicBezier = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): DtcgToken<'cubicBezier', [number, number, number, number]> => ({
  $value: [x1, y1, x2, y2],
  $type: 'cubicBezier'
})

export const fontFamily = (...fonts: string[]): DtcgToken<'fontFamily', string[]> => ({
  $value: fonts,
  $type: 'fontFamily'
})

export const fontWeight = (value: number): DtcgToken<'fontWeight', number> => ({
  $value: value,
  $type: 'fontWeight'
})

export const typography = (value: TypographyValue): DtcgToken<'typography', TypographyValue> => ({
  $value: value,
  $type: 'typography'
})

export const shadow = (value: ShadowValue): DtcgToken<'shadow', ShadowValue> => ({
  $value: value,
  $type: 'shadow'
})

export function scale<K extends string, V, T>(
  entries: Record<K, V>,
  builder: (value: V, key: K) => T
): Record<K, T> {
  return Object.fromEntries(
    Object.entries(entries).map(([k, v]) => [k, builder(v as V, k as K)])
  ) as Record<K, T>
}

export type OklchTuple = readonly [number, number, number] | readonly [number, number, number, number]

export function oklchPalette<K extends string>(
  stops: Record<K, OklchTuple>
): Record<K, DtcgToken<'color', OklchColorValue>> {
  return scale(stops, (tuple) => oklch(tuple[0], tuple[1], tuple[2], tuple[3] ?? 1))
}

export function ref<T extends DtcgType, P extends string = string>(
  type: T,
  path: P
): DtcgToken<T, `{${P}}`> {
  return {
    $value: `{${path}}`,
    $type: type
  }
}

export function refMap<T extends DtcgType, K extends string, P extends string>(
  type: T,
  entries: Record<K, P>
): Record<K, DtcgToken<T, `{${P}}`>> {
  return Object.fromEntries(
    Object.entries(entries).map(([k, p]) => [k, ref(type, p as P)])
  ) as Record<K, DtcgToken<T, `{${P}}`>>
}

export function themed<T extends DtcgToken>(light: T, dark: T): ThemedToken<T> {
  return {
    __themed: true,
    light,
    dark
  }
}

export function isThemedToken(node: unknown): node is ThemedToken {
  return (
    !!node &&
    typeof node === 'object' &&
    '__themed' in node &&
    (node as ThemedToken).__themed === true
  )
}

export function isDtcgToken(node: unknown): node is DtcgToken {
  return (
    !!node &&
    typeof node === 'object' &&
    !Array.isArray(node) &&
    '$value' in node &&
    '$type' in node
  )
}
