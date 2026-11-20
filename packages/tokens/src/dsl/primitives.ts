import { oklchToHex } from '../../utils/color.js'
import type {
  DtcgToken,
  DimensionValue,
  DurationValue,
  OklchColorValue,
  ShadowValue,
  TypographyValue
} from './types.ts'

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

/**
 * Maps a record of raw values into DTCG tokens using `builder`.
 */
export function scale<K extends string, V, T>(
  entries: Record<K, V>,
  builder: (value: V, key: K) => T
): Record<K, T> {
  return Object.fromEntries(
    Object.entries(entries).map(([k, v]) => [k, builder(v as V, k as K)])
  ) as Record<K, T>
}

export type OklchTuple = readonly [number, number, number] | readonly [number, number, number, number]

/**
 * Builds an OKLCH color scale from compact `[L, C, H]` or `[L, C, H, alpha]` tuples.
 */
export function oklchPalette<K extends string>(
  stops: Record<K, OklchTuple>
): Record<K, DtcgToken<'color', OklchColorValue>> {
  return scale(stops, (tuple) => oklch(tuple[0], tuple[1], tuple[2], tuple[3] ?? 1))
}
