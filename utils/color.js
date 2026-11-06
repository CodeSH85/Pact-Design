/**
 * @file
 * OKLCH <-> sRGB / HEX conversion utilities for DTCG color tokens,
 * powered by chroma-js.
 */

import chroma from 'chroma-js'
import { clamp01, isFalsy, round } from './helper.js'

/**
 * Constructs a chroma Color object from any DTCG color token value, CSS string, or raw components.
 * @param {object} DTCGColorToken
 */
export function toColor(DTCGColorToken) {
  if (!DTCGColorToken) return null

  if (typeof DTCGColorToken === 'object') {
    if (DTCGColorToken.colorSpace && Array.isArray(DTCGColorToken.components)) {
      return chroma(DTCGColorToken.components, DTCGColorToken.colorSpace)
    }
    if (DTCGColorToken.hex) return chroma(DTCGColorToken.hex)
  }
  return chroma(DTCGColorToken)
}

/**
 * @returns {{ r:number, g:number, b:number, inGamut:boolean }} gamma-encoded sRGB in 0..1
 * */
export function oklchToRgb(L, C, H) {
  try {
    const c = chroma([Number(L) || 0, Number(C) || 0, Number(H) || 0], 'oklch')
    const [r, g, b] = c.rgb()
    return {
      r: clamp01(r / 255),
      g: clamp01(g / 255),
      b: clamp01(b / 255),
      inGamut: !c.clipped()
    }
  } catch {
    return { r: 0, g: 0, b: 0, inGamut: false }
  }
}

export function rgbToOklch({ r, g, b }) {
  try {
    const [L, C, H] = chroma([clamp01(r) * 255, clamp01(g) * 255, clamp01(b) * 255]).oklch()
    const validC = C < 0.0001 ? 0 : round(C)
    const validH = isNaN(H) || validC === 0 ? 0 : round(H)
    return [round(L), validC, validH]
  } catch {
    return [0, 0, 0]
  }
}

export function hexToRgb(hex) {
  if (!hex) return null

  try {
    const c = chroma(String(hex).trim())
    const [r, g, b, a] = c.rgba()
    return { r: r / 255, g: g / 255, b: b / 255, a: round(a) }
  } catch {
    return null
  }
}

export function rgbToHex({ r, g, b }) {
  return chroma([clamp01(r) * 255, clamp01(g) * 255, clamp01(b) * 255]).hex()
}

/**
 * Converts OKLCH coordinates to a HEX string.
 * Supports both `oklchToHex(L, C, H)` and `oklchToHex([L, C, H])`.
 */
export function oklchToHex(...args) {
  const [L, C, H] = args.length === 1 && Array.isArray(args[0]) ? args[0] : args
  if (isFalsy(L) || isFalsy(C) || isFalsy(H)) return null
  try {
    return chroma([Number(L), Number(C), Number(H)], 'oklch').hex()
  } catch {
    return null
  }
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
  try {
    const c = chroma(hex)
    const [L, C, H] = c.oklch()
    const validC = C < 0.0001 ? 0 : round(C)
    const validH = isNaN(H) || validC === 0 ? 0 : round(H)
    return {
      colorSpace: 'oklch',
      components: [round(L), validC, validH],
      alpha: round(c.alpha()),
      hex: c.hex()
    }
  } catch {
    return hex
  }
}

/**
 * Normalises any supported DTCG or CSS colour value to sRGB `{ r, g, b, a, inGamut }`.
 * Supports: hex strings, `oklch(...)` CSS strings, `rgb(...)` CSS strings,
 * and `{ colorSpace: 'oklch' | 'srgb', components, alpha, hex }` objects.
 */
export function colorValueToRgb(value) {
  try {
    const c = toColor(value)
    if (!c) return null
    const [r, g, b, a] = c.rgba()
    return {
      r: clamp01(r / 255),
      g: clamp01(g / 255),
      b: clamp01(b / 255),
      a: clamp01(a),
      inGamut: !c.clipped()
    }
  } catch {
    return null
  }
}

/** Extracts [L, C, H] from any supported color value. */
export function colorValueToOklch(value) {
  if (value && typeof value === 'object' && value.colorSpace === 'oklch') {
    return value.components.map(Number)
  }
  try {
    const c = toColor(value)
    if (!c) return [0, 0, 0]
    const [L, C, H] = c.oklch()
    const validC = C < 0.0001 ? 0 : round(C)
    const validH = isNaN(H) || validC === 0 ? 0 : round(H)
    return [round(L), validC, validH]
  } catch {
    return [0, 0, 0]
  }
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
  try {
    const c = toColor(value)
    return c ? c.hex() : '#000000'
  } catch {
    return '#000000'
  }
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
