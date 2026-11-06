import { round } from './helper.js'
import { getTokenColorString, toColor } from './color.js'
import { contrast as _contrast, contrastAPCA } from 'chroma-js'

export { getTokenColorString }

/**
 * Calculates WCAG 2.x contrast ratio between two color values (any supported format).
 */
export function calculateContrast(colorVal, backgroundVal = '#ffffff') {
  try {
    const ca = toColor(colorVal)
    const cb = toColor(backgroundVal)
    if (!ca || !cb) return 0
    return round(_contrast(ca, cb), 2)
  } catch {
    return 0
  }
}

export const contrast = calculateContrast

/**
 * Check WCAG 2.x contrast level by ratio value
 * @param {number} ratio
 * @returns {string}
 */
export function wcagLevel(ratio) {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA Large'
  return 'Fail'
}

/**
 * Calculates APCA-W3 (0.1.9 / SAPC 4g) perceptual lightness contrast (Lc)
 * between foreground `textVal` and `backgroundVal`.
 * Note: APCA is polarity-sensitive — `textVal` (foreground) and `backgroundVal` (background) are NOT interchangeable.
 * Positive Lc = dark text on light background (BoW).
 * Negative Lc = light text on dark background (WoB).
 */
export function calculateAPCA(textVal, backgroundVal = '#ffffff') {
  try {
    const ct = toColor(textVal)
    const cb = toColor(backgroundVal)
    if (!ct || !cb) return 0
    return round(contrastAPCA(ct, cb), 1)
  } catch {
    return 0
  }
}

export const apcaContrast = calculateAPCA

/**
 * APCA Bronze/Silver level classification based on |Lc|:
 * - Lc 90+: Preferred fluent body text
 * - Lc 75+: Body text (16px/400)
 * - Lc 60+: Content / UI label / button text (16px/600 or 24px/400)
 * - Lc 45+: Large headline / icon (24px/700 or 36px/400)
 * - Lc 30+: Spot / sub-semantic / disabled / border
 * - < 30:   Fail (non-text / decorative only)
 */
export function apcaLevel(lc) {
  const abs = Math.abs(lc)
  if (abs >= 90) return { tier: 'Lc 90+', usage: 'Preferred Body', css: 'Lc-90' }
  if (abs >= 75) return { tier: 'Lc 75+', usage: 'Body Text', css: 'Lc-75' }
  if (abs >= 60) return { tier: 'Lc 60+', usage: 'Content / UI', css: 'Lc-60' }
  if (abs >= 45) return { tier: 'Lc 45+', usage: 'Large / Icon', css: 'Lc-45' }
  if (abs >= 30) return { tier: 'Lc 30+', usage: 'Spot / Border', css: 'Lc-30' }
  return { tier: 'Fail', usage: 'Low (<30)', css: 'Fail' }
}

/** Picks black or white text for the best APCA perceptual contrast on a given background colour value. */
export const readableOn = (value) =>
  Math.abs(calculateAPCA('#ffffff', value)) >= Math.abs(calculateAPCA('#000000', value))
    ? '#fff'
    : '#000'

/**
 * Evaluates APCA and WCAG 2.1 compliance details for a color against a background
 */
export function evaluateWCAG(colorVal, backgroundVal = '#ffffff', targetMinRatio = 4.5, targetMinLc = 60) {
  const ratio = calculateContrast(colorVal, backgroundVal)
  const lc = calculateAPCA(colorVal, backgroundVal)
  const absLc = Math.abs(lc)
  const colorStr = getTokenColorString(colorVal) || colorVal

  // APCA |Lc| is the primary perceptual contrast criterion
  const passesTarget = absLc >= targetMinLc

  return {
    lc,
    absLc,
    targetMinLc,
    ratio,
    targetMinRatio,
    passesTarget,
    passesAANormal: ratio >= 4.5,
    passesAALarge: ratio >= 3.0,
    passesAAANormal: ratio >= 7.0,
    colorStr,
    backgroundVal
  }
}

/**
 * Parses `build/css/_variables.css` into Light and Dark CSS custom property maps
 */
export function parseCssVariables(cssContent) {
  const lightBlockMatch = cssContent.match(/:root,\s*\[data-theme="light"\]\s*\{([\s\S]*?)\}/)
  const darkBlockMatch = cssContent.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\}/)

  const parseDecls = (block = '') => {
    const map = new Map()
    const declRegex = /^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm
    let match
    while ((match = declRegex.exec(block)) !== null) {
      map.set(match[1], match[2].trim())
    }
    return map
  }

  const lightRaw = parseDecls(lightBlockMatch?.[1])
  const darkOverrides = parseDecls(darkBlockMatch?.[1])
  const darkRaw = new Map([...lightRaw, ...darkOverrides])

  return { lightRaw, darkOverrides, darkRaw }
}

/**
 * Resolves `var(--*)` chains in a CSS variable map to final primitive values
 */
export function resolveCssVariable(varName, varMap, seen = new Set()) {
  if (seen.has(varName)) {
    throw new Error(`Circular CSS variable reference detected: ${[...seen, varName].join(' -> ')}`)
  }
  const raw = varMap.get(varName)
  if (raw === undefined) {
    throw new Error(`Missing CSS variable "${varName}"`)
  }

  const nextSeen = new Set(seen)
  nextSeen.add(varName)

  return raw.replace(/var\((--[a-z0-9-]+)\)/g, (_, refName) => {
    return resolveCssVariable(refName, varMap, nextSeen)
  })
}
