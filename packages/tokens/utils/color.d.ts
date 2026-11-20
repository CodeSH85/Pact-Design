export interface RgbColor {
  r: number
  g: number
  b: number
}

export interface OklchColorObject {
  colorSpace: 'oklch'
  components: [number, number, number]
  alpha: number
  hex: string
}

export function toColor(DTCGColorToken: unknown): unknown
export function oklchToRgb(L: number, C: number, H: number): RgbColor & { inGamut: boolean }
export function rgbToOklch(rgb: RgbColor): [number, number, number]
export function hexToRgb(hex: string): (RgbColor & { a: number }) | null
export function rgbToHex(rgb: RgbColor): string
export function oklchToHex(...args: [number, number, number] | [[number, number, number]]): string | null
export function hexToOklch(hex: string): OklchColorObject | string
export function colorValueToRgb(value: unknown): (RgbColor & { a: number, inGamut: boolean }) | null
export function colorValueToOklch(value: unknown): [number, number, number]
export function colorValueToCss(value: unknown): string
export function colorValueToHex(value: unknown): string
export function getTokenColorString(value: unknown): string | null
