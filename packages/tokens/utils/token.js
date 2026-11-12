/**
 * DTCG token utilities: flatten, resolve aliases, format token values,
 * transform HEX colors to OKLCH, and generate CSS custom properties.
 */
import { kebab, round } from './helper.js'
import { colorValueToCss, colorValueToHex, hexToOklch } from './color.js'

export const REF_RE = /^\{([^{}]+)\}$/

export const TYPOGRAPHY_PROPS = {
  fontFamily: { type: 'fontFamily', css: 'font-family', hint: 'family' },
  fontSize: { type: 'dimension', css: 'font-size', hint: 'font.size' },
  fontWeight: { type: 'fontWeight', css: 'font-weight', hint: 'weight' },
  lineHeight: { type: 'number', css: 'line-height', hint: 'line-height' },
  letterSpacing: { type: 'dimension', css: 'letter-spacing', hint: 'letter-spacing' }
}

export const SHADOW_PROPS = {
  offsetX: { type: 'dimension', css: 'offset-x', hint: 'offset' },
  offsetY: { type: 'dimension', css: 'offset-y', hint: 'offset' },
  blur: { type: 'dimension', css: 'blur', hint: 'blur' },
  spread: { type: 'dimension', css: 'spread', hint: 'spread' },
  color: { type: 'color', css: 'color', hint: 'shadow.color' }
}

export const isToken = (node) =>
  !!node && typeof node !== 'function' && typeof node === 'object' && !Array.isArray(node) && '$value' in node

export const refOf = (value) => (typeof value === 'string' ? value.match(REF_RE)?.[1] ?? null : null)

export class TokenError extends Error {}

/**
 * JS objects hoist integer-like keys ("10") ahead of others ("01"), which would
 * scramble scales such as 01…10. When every sibling key is numeric we sort numerically;
 * otherwise insertion order is kept.
 */
export function orderedEntries(obj) {
  const entries = Object.entries(obj)
  const keys = entries.map(([k]) => k).filter((k) => !k.startsWith('$'))
  if (keys.length > 1 && keys.every((k) => /^\d+$/.test(k))) {
    return entries.sort(([a], [b]) => {
      const ma = a.startsWith('$')
      const mb = b.startsWith('$')
      if (ma || mb) return ma === mb ? 0 : ma ? -1 : 1
      return Number(a) - Number(b)
    })
  }
  return entries
}

/** JSON.stringify that applies `orderedEntries` to every object (2-space indent). */
export function stringifyTokens(value, indent = '') {
  const next = `${indent}  `
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    if (value.every((v) => typeof v === 'string')) return `[${value.map((v) => JSON.stringify(v)).join(', ')}]`
    return `[\n${value.map((v) => next + stringifyTokens(v, next)).join(',\n')}\n${indent}]`
  }
  if (value && typeof value === 'object') {
    const entries = orderedEntries(value).filter(([, v]) => v !== undefined)
    if (!entries.length) return '{}'
    return `{\n${entries.map(([k, v]) => `${next}${JSON.stringify(k)}: ${stringifyTokens(v, next)}`).join(',\n')}\n${indent}}`
  }
  return JSON.stringify(value)
}

export const themeOf = (file) =>
  file.endsWith('.dark.json') ? 'dark' : file.endsWith('.light.json') ? 'light' : null

export const categoryOf = (file) => file.split('/').at(-2)

export const levelOf = (file) =>
  file.split('/').at(-1).replace(/\.(light|dark)\.json$/, '').replace(/\.json$/, '')

export const filterFilesForTheme = (files, theme = 'light') =>
  Object.fromEntries(
    Object.entries(files).filter(([file]) => {
      const t = themeOf(file)
      return t === null || t === theme
    })
  )

/**
 * @typedef {{ id:string, path:string[], file:string, node:any, type?:string }} Token
 * @param {Record<string, any>} files  relative file path -> parsed JSON
 * @param {'light'|'dark'|null} [theme='light']  active theme filter (null disables filtering)
 */
export function flatten(files, theme = 'light') {
  /** @type {Map<string, Token>} */
  const tokens = new Map()
  const issues = []
  const sourceFiles = theme ? filterFilesForTheme(files, theme) : files

  const walk = (node, path, inheritedType, file) => {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return
    const type = node.$type ?? inheritedType
    if (isToken(node)) {
      const id = path.join('.')
      if (tokens.has(id)) {
        issues.push({ id, file, message: `重複定義，覆蓋了 ${tokens.get(id).file} 中的同名 token` })
      }
      tokens.set(id, { id, path, file, node, type })
      return
    }
    for (const [key, child] of orderedEntries(node)) {
      if (!key.startsWith('$')) walk(child, [...path, key], type, file)
    }
  }

  for (const [file, json] of Object.entries(sourceFiles)) walk(json, [], undefined, file)

  // Alias tokens without an explicit $type inherit the type of their target
  for (const token of tokens.values()) {
    if (token.type) continue
    let ref = refOf(token.node.$value)
    const seen = new Set()
    while (ref && !seen.has(ref)) {
      seen.add(ref)
      const target = tokens.get(ref)
      if (!target) break
      if (target.type) { token.type = target.type; break }
      ref = refOf(target.node.$value)
    }
    if (!token.type) issues.push({ id: token.id, file: token.file, message: '缺少 $type，且無法從引用推斷' })
  }

  return { tokens, issues }
}

/** Recursively resolves `{alias}` references anywhere inside a value. */
export function resolveValue(value, tokens, stack = []) {
  const ref = refOf(value)
  if (ref) {
    if (stack.includes(ref)) throw new TokenError(`循環引用：${[...stack, ref].join(' → ')}`)
    const target = tokens.get(ref)
    if (!target) throw new TokenError(`找不到引用 {${ref}}`)
    return resolveValue(target.node.$value, tokens, [...stack, ref])
  }
  if (Array.isArray(value)) return value.map((v) => resolveValue(v, tokens, stack))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveValue(v, tokens, stack)]))
  }
  return value
}

export function tryResolve(token, tokens) {
  try {
    return { value: resolveValue(token.node.$value, tokens, [token.id]) }
  // eslint-disable-next-line @stylistic/space-before-function-paren
  } catch (err) {
    return { error: err.message }
  }
}

/** Collects every alias used by a token (including inside composite values). */
export function collectRefs(value, out = []) {
  const ref = refOf(value)
  if (ref) out.push(ref)
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collectRefs(v, out))
  return out
}

/** Checks whether `candidateId` transitively references `targetId` in `tokens`. */
export function dependsOn(candidateId, targetId, tokens, seen = new Set()) {
  if (candidateId === targetId) return true
  if (seen.has(candidateId)) return false
  seen.add(candidateId)
  const t = tokens.get(candidateId)
  return !!t && collectRefs(t.node.$value).some((ref) => dependsOn(ref, targetId, tokens, seen))
}

/** Map of token id -> ids of tokens that reference it. */
export function buildUsage(tokens) {
  const usage = new Map()
  for (const token of tokens.values()) {
    for (const ref of collectRefs(token.node.$value)) {
      if (!usage.has(ref)) usage.set(ref, [])
      usage.get(ref).push(token.id)
    }
  }
  return usage
}

export const cssName = (path) => `--${(Array.isArray(path) ? path : path.split('.')).map(kebab).join('-')}`

export function toPx(dim) {
  if (!dim || typeof dim !== 'object') return null
  const n = Number(dim.value)
  if (dim.unit === 'px') return n
  if (dim.unit === 'rem' || dim.unit === 'em') return n * 16
  return null
}

export function parseDimension(value) {
  if (value && typeof value === 'object') return { value: Number(value.value), unit: value.unit ?? 'px' }
  const m = String(value).match(/^(-?[\d.]+)\s*([a-z%]*)$/i)
  return m ? { value: Number(m[1]), unit: m[2] || 'px' } : { value: 0, unit: 'px' }
}

export function dimensionToCss(v) {
  if (v && typeof v === 'object' && 'value' in v) return `${v.value}${v.unit ?? ''}`
  return String(v ?? '')
}

export function fontFamilyToCss(v) {
  const list = Array.isArray(v) ? v : String(v).split(',')
  return list
    .map((f) => String(f).trim())
    .map((f) => (/\s/.test(f) && !/^['"]/.test(f) ? `"${f}"` : f))
    .join(', ')
}

/** Converts a *resolved* value of a given DTCG type into a CSS value. */
export function valueToCss(type, v) {
  switch (type) {
    case 'color': return colorValueToCss(v)
    case 'dimension':
    case 'duration': return dimensionToCss(v)
    case 'fontFamily': return fontFamilyToCss(v)
    case 'fontWeight':
    case 'number':
    case 'strokeStyle': return typeof v === 'object' ? null : String(v)
    case 'cubicBezier': return Array.isArray(v) ? `cubic-bezier(${v.join(', ')})` : null
    default: return typeof v === 'object' ? null : String(v)
  }
}

/** Formats a resolved token value for human-readable UI display. */
export function formatValue(type, v) {
  if (v === undefined) return ''
  switch (type) {
    case 'color': {
      const alpha = v && typeof v === 'object' && v.alpha !== undefined && v.alpha < 1 ? ` · α ${v.alpha}` : ''
      return colorValueToHex(v) + alpha
    }
    case 'dimension': {
      const px = toPx(v)
      const css = dimensionToCss(v)
      return px !== null && v.unit !== 'px' ? `${css} · ${round(px, 2)}px` : css
    }
    case 'duration': return dimensionToCss(v)
    case 'cubicBezier': return Array.isArray(v) ? `cubic-bezier(${v.join(', ')})` : String(v)
    case 'fontFamily': return fontFamilyToCss(v)
    case 'typography': {
      const size = toPx(v.fontSize)
      const parts = [
        size !== null ? `${round(size, 2)}px` : dimensionToCss(v.fontSize),
        `/ ${v.lineHeight}`,
        `· ${v.fontWeight}`,
        `· ls ${dimensionToCss(v.letterSpacing)}`
      ]
      return parts.join(' ')
    }
    case 'shadow': {
      const pxOrCss = (d) => {
        const px = toPx(d)
        return px !== null ? `${round(px, 2)}px` : dimensionToCss(d)
      }
      const c = v.color && typeof v.color === 'object' && v.color.alpha !== undefined && v.color.alpha < 1
        ? `${colorValueToHex(v.color)} · α ${v.color.alpha}`
        : colorValueToHex(v.color)
      return `${pxOrCss(v.offsetX)} ${pxOrCss(v.offsetY)} ${pxOrCss(v.blur)} ${pxOrCss(v.spread)} · ${c}`
    }
    default: return typeof v === 'object' ? JSON.stringify(v) : String(v)
  }
}

/** CSS for a possibly-aliased value: aliases become var() so the cascade stays live. */
function partToCss(type, raw, tokens, selfId) {
  const ref = refOf(raw)
  if (ref) {
    if (!tokens.has(ref)) throw new TokenError(`找不到引用 {${ref}}`)
    return `var(${cssName(ref)})`
  }
  return valueToCss(type, resolveValue(raw, tokens, [selfId]))
}

function buildCssBlock(tokens, filterPred = () => true) {
  const lines = []
  const errors = []

  for (const token of tokens.values()) {
    if (!filterPred(token)) continue
    const name = cssName(token.path)
    const raw = token.node.$value
    try {
      // Validate the whole chain first (catches cycles / broken refs deeper down)
      resolveValue(raw, tokens, [token.id])

      if (token.type === 'typography') {
        const ref = refOf(raw)
        for (const [prop, meta] of Object.entries(TYPOGRAPHY_PROPS)) {
          const sub = ref
            ? `var(${cssName(ref)}-${kebab(prop)})`
            : raw?.[prop] !== undefined ? partToCss(meta.type, raw[prop], tokens, token.id) : null
          if (sub) lines.push(`  ${name}-${kebab(prop)}: ${sub};`)
        }
        // `font` shorthand for convenience: weight size/line-height family
        lines.push(
          `  ${name}: var(${name}-font-weight) var(${name}-font-size)/var(${name}-line-height) var(${name}-font-family);`
        )
        continue
      }

      if (token.type === 'shadow') {
        const ref = refOf(raw)
        for (const [prop, meta] of Object.entries(SHADOW_PROPS)) {
          const sub = ref
            ? `var(${cssName(ref)}-${kebab(prop)})`
            : raw?.[prop] !== undefined ? partToCss(meta.type, raw[prop], tokens, token.id) : null
          if (sub) lines.push(`  ${name}-${kebab(prop)}: ${sub};`)
        }
        lines.push(
          `  ${name}: var(${name}-offset-x) var(${name}-offset-y) var(${name}-blur) var(${name}-spread) var(${name}-color);`
        )
        continue
      }

      const css = partToCss(token.type, raw, tokens, token.id)
      if (css === null) throw new TokenError(`不支援輸出 ${token.type} 類型的值`)
      lines.push(`  ${name}: ${css};`)
    // eslint-disable-next-line @stylistic/space-before-function-paren
    } catch (err) {
      errors.push({ id: token.id, file: token.file, message: err.message })
      lines.push(`  /* ${name}: ${err.message} */`)
    }
  }

  return { lines, errors }
}

/**
 * @returns {{ css: string, errors: {id:string, file:string, message:string}[] }}
 */
export function buildCss(tokens, darkTokens = null) {
  const base = buildCssBlock(tokens)
  const errors = [...base.errors]
  let css = `:root, [data-theme="light"], [data-canvas="light"] {\n${base.lines.join('\n')}\n}\n`

  if (darkTokens) {
    const dark = buildCssBlock(darkTokens, (t) => themeOf(t.file) === 'dark')
    errors.push(...dark.errors)
    if (dark.lines.length) {
      css += `\n[data-theme="dark"], [data-canvas="dark"] {\n${dark.lines.join('\n')}\n}\n`
    }
  }

  return { css, errors }
}

/**
 * Recursively parses design token tree and converts HEX color values into OKLCH objects.
 *
 * @param {object} node - Design token object or group node
 * @returns {object} Transformed token node
 */
export function parseAndTransformTokens(node) {
  if (!node || typeof node !== 'object') {
    return node
  }

  const isColorToken = node.$type === 'color' || node.type === 'color'

  if (isColorToken) {
    const valueKey = '$value' in node ? '$value' : ('value' in node ? 'value' : null)
    if (valueKey) {
      const value = node[valueKey]
      const isHEXColorValue = typeof value === 'string' && value.startsWith('#')
      if (isHEXColorValue) {
        return {
          ...node,
          [valueKey]: hexToOklch(value)
        }
      } else if (typeof value === 'object' && value !== null && value.hex) {
        return {
          ...node,
          [valueKey]: hexToOklch(value.hex)
        }
      }
    }
  }

  const result = Array.isArray(node) ? [] : {}

  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'object' && value !== null) {
      result[key] = parseAndTransformTokens(value)
    } else {
      result[key] = value
    }
  }
  return result
}

/**
 * Creates a CSS variable string from a token entry.
 * Supports both string hex values and OKLCH object values.
 *
 * @param {object} params
 * @param {object} params.token - Single token object e.g. { "50": { "$type": "color", "$value": ... } }
 * @returns {string} CSS variable declaration string
 */
export function createCSSVariable({ token }) {
  const [[key, tokenData]] = Object.entries(token)
  const type = tokenData.$type || tokenData.type
  const val = tokenData.$value || tokenData.value

  if (typeof val === 'object' && val !== null && val.colorSpace === 'oklch') {
    return `--${type}-${key}: ${colorValueToCss(val)};`
  }
  return `--${type}-${key}: ${val};`
}
