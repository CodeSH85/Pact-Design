/**
 * Dependency-free OKLCH <-> sRGB / HEX conversion utilities for DTCG color tokens.
 * Math based on Björn Ottosson's OKLab reference implementation.
 */
import { clamp01, isFalsy, round } from './helper.js'

export const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
export const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

/** @returns {{ r:number, g:number, b:number, inGamut:boolean }} gamma-encoded sRGB in 0..1 */
export function oklchToRgb(L, C, H) {
  const hr = ((Number(H) || 0) * Math.PI) / 180
  const a = C * Math.cos(hr)
  const b = C * Math.sin(hr)

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3

  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  const eps = 0.0005
  const inGamut = [lr, lg, lb].every((v) => v >= -eps && v <= 1 + eps)
  return { r: clamp01(toGamma(lr)), g: clamp01(toGamma(lg)), b: clamp01(toGamma(lb)), inGamut }
}

export function rgbToOklch({ r, g, b }) {
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)

  const l = Math.cbrt(0.4122214708 * lr + 0.5363649185 * lg + 0.0514616106 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const C = Math.sqrt(A * A + B * B)
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360
  // Achromatic colours have no meaningful hue
  if (C < 0.0001) H = 0
  return [round(L), round(C < 0.0001 ? 0 : C), round(H)]
}

export function hexToRgb(hex) {
  let h = String(hex).trim().replace(/^#/, '')
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('')
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) return null
  const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 }
}

export function rgbToHex({ r, g, b }) {
  const p = (v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, '0')
  return `#${p(r)}${p(g)}${p(b)}`
}

/**
 * Converts OKLCH coordinates to a HEX string.
 * Supports both `oklchToHex(L, C, H)` and `oklchToHex([L, C, H])`.
 */
export function oklchToHex(...args) {
  const [L, C, H] = args.length === 1 && Array.isArray(args[0]) ? args[0] : args
  if (isFalsy(L) || isFalsy(C) || isFalsy(H)) return null
  return rgbToHex(oklchToRgb(L, C, H))
}

/**
 * Converts a HEX color string (e.g. "#f3f3f3") into a DTCG OKLCH color object.
 *
 * @param {string} hex - HEX color string
 * @returns {object|string} DTCG OKLCH color object
 */
export function hexToOklch(hex) {
  if (typeof hex !== 'string' || !hex.startsWith('#')) {
    return hex
  }
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return {
    colorSpace: 'oklch',
    components: rgbToOklch(rgb),
    alpha: round(rgb.a ?? 1),
    hex: rgbToHex(rgb)
  }
}

function parsePercentOrNumber(str, scale = 1) {
  const s = String(str).trim()
  if (s.endsWith('%')) return (parseFloat(s) / 100) * scale
  return parseFloat(s)
}

/**
 * Normalises any supported DTCG or CSS colour value to sRGB `{ r, g, b, a, inGamut }`.
 * Supports: hex strings, `oklch(...)` CSS strings, `rgb(...)` CSS strings,
 * and `{ colorSpace: 'oklch' | 'srgb', components, alpha, hex }` objects.
 */
export function colorValueToRgb(value) {
  if (!value) return null
  if (typeof value === 'string') {
    const str = value.trim()
    if (str.startsWith('#')) return hexToRgb(str)

    const oklchMatch = str.match(
      /^oklch\(\s*([\d.+-]+%?)\s+([\d.+-]+%?)\s+([\d.+-]+)(?:deg)?(?:\s*\/\s*([\d.+-]+%?))?\s*\)$/i
    )
    if (oklchMatch) {
      const L = parsePercentOrNumber(oklchMatch[1], 1)
      const C = parsePercentOrNumber(oklchMatch[2], 0.4)
      const H = parseFloat(oklchMatch[3])
      const a = oklchMatch[4] !== undefined ? parsePercentOrNumber(oklchMatch[4], 1) : 1
      return { ...oklchToRgb(L, C, H), a }
    }

    const rgbMatch = str.match(
      /^rgba?\(\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i
    )
    if (rgbMatch) {
      const parseChan = (c) => (c.endsWith('%') ? parseFloat(c) / 100 : parseFloat(c) / 255)
      const a = rgbMatch[4] !== undefined ? parsePercentOrNumber(rgbMatch[4], 1) : 1
      return {
        r: clamp01(parseChan(rgbMatch[1])),
        g: clamp01(parseChan(rgbMatch[2])),
        b: clamp01(parseChan(rgbMatch[3])),
        a: clamp01(a),
        inGamut: true
      }
    }

    return hexToRgb(str)
  }
  if (typeof value === 'object') {
    if (value.colorSpace === 'oklch' && Array.isArray(value.components)) {
      const [L, C, H] = value.components
      return { ...oklchToRgb(L, C, H), a: value.alpha ?? 1 }
    }
    if (value.colorSpace === 'srgb' && Array.isArray(value.components)) {
      const [r, g, b] = value.components
      return { r, g, b, a: value.alpha ?? 1, inGamut: true }
    }
    if (value.hex) return hexToRgb(value.hex)
  }
  return null
}

/** Extracts [L, C, H] from any supported colour value. */
export function colorValueToOklch(value) {
  if (value && typeof value === 'object' && value.colorSpace === 'oklch') {
    return value.components.map(Number)
  }
  const rgb = colorValueToRgb(value)
  return rgb ? rgbToOklch(rgb) : [0, 0, 0]
}

export function colorValueToCss(value) {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return String(value)
  const alpha = value.alpha !== undefined && value.alpha < 1 ? ` / ${value.alpha}` : ''
  if (value.colorSpace === 'oklch' && Array.isArray(value.components)) {
    const [L, C, H] = value.components
    return `oklch(${L} ${C} ${H}${alpha})`
  }
  if (value.colorSpace === 'srgb' && Array.isArray(value.components)) {
    const [r, g, b] = value.components.map((c) => Math.round(c * 255))
    return `rgb(${r} ${g} ${b}${alpha})`
  }
  return value.hex ?? 'transparent'
}

export function colorValueToHex(value) {
  if (value && typeof value === 'object' && value.hex) return value.hex
  const rgb = colorValueToRgb(value)
  return rgb ? rgbToHex(rgb) : '#000000'
}

/**
 * Extracts hex or CSS color string from a token value (handles both HEX strings & OKLCH token objects)
 */
export function getTokenColorString(value) {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    if (value.hex) return value.hex
    if (value.colorSpace === 'oklch' && Array.isArray(value.components)) {
      return colorValueToCss(value)
    }
  }
  return null
}
