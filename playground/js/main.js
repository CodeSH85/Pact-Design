/* global document, Node, clearTimeout, setTimeout, requestAnimationFrame, navigator, CSS, confirm, fetch, Blob, URL, window */
/**
 * Pact Design Token Playground — editor state, controls and wiring.
 */
import { clone, round, same } from '../../utils/helper.js'
import * as T from '../../utils/token.js'
import * as C from '../../utils/color.js'
import { apcaContrast, apcaLevel, contrast, readableOn, wcagLevel } from '../../utils/contrast.js'
import { renderPreview } from './preview.js'

// ---------------------------------------------------------------------------
// Tiny DOM helpers
// ---------------------------------------------------------------------------
const $ = (sel, el = document) => el.querySelector(sel)
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)]

function h(tag, props = {}, ...children) {
  const el = document.createElement(tag)
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue
    if (key === 'class') el.className = value
    else if (key === 'style') el.style.cssText = value
    else if (key === 'dataset') Object.assign(el.dataset, value)
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value)
    else if (key in el && typeof value !== 'string') el[key] = value
    else el.setAttribute(key, value === true ? '' : value)
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue
    el.append(child instanceof Node ? child : document.createTextNode(String(child)))
  }
  return el
}

const control = (label, ...children) =>
  h('div', { class: 'control' }, label ? h('span', { class: 'sub-label' }, label) : null, ...children)

function toast(message, isError = false) {
  const el = $('#toast')
  el.textContent = message
  el.classList.toggle('error', isError)
  el.classList.add('show')
  clearTimeout(toast.timer)
  toast.timer = setTimeout(() => el.classList.remove('show'), 2200)
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const CATEGORY_LABELS = {
  color: '色彩', typography: '字體', spacing: '間距', sizing: '尺寸', border: '邊框', elevation: '陰影', motion: '動態'
}
const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS)
const LEVEL_ORDER = ['global', 'system', 'component']

const state = {
  files: {},
  original: {},
  originalTokensByTheme: { light: new Map(), dark: new Map() },
  originalTokens: new Map(),
  tokens: new Map(),
  usage: new Map(),
  resolved: new Map(),
  errorsById: new Map(),
  errors: [],
  issues: [],
  loadErrors: {},
  css: '',
  theme: 'light',
  category: null,
  query: '',
  level: 'all',
  selectedShade: {},
  paletteTools: new Set(),
  swatchContrastMode: 'lc-white',
  sidebarCollapsed: false
}

const fileDirty = (file) => !same(state.files[file], state.original[file])
const dirtyFiles = () => Object.keys(state.files).filter(fileDirty)
const tokenDirty = (id) => {
  const cur = state.tokens.get(id)
  const orig = state.originalTokens.get(id)
  return !orig || !cur || !same(cur.node.$value, orig.node.$value)
}

// ---------------------------------------------------------------------------
// Recompute pipeline (coalesced to one run per animation frame)
// ---------------------------------------------------------------------------
function recompute() {
  const lightFlat = T.flatten(state.files, 'light')
  const darkFlat = T.flatten(state.files, 'dark')
  const activeFlat = state.theme === 'dark' ? darkFlat : lightFlat

  // Check parity between *.light.json and *.dark.json token sets
  const parityIssues = []
  for (const t of lightFlat.tokens.values()) {
    if (T.themeOf(t.file) === 'light' && !darkFlat.tokens.has(t.id)) {
      parityIssues.push({ id: t.id, file: t.file, message: '在深色主題 (*.dark.json) 中缺少對應的同名 token' })
    }
  }
  for (const t of darkFlat.tokens.values()) {
    if (T.themeOf(t.file) === 'dark' && !lightFlat.tokens.has(t.id)) {
      parityIssues.push({ id: t.id, file: t.file, message: '在淺色主題 (*.light.json) 中缺少對應的同名 token' })
    }
  }

  state.tokens = activeFlat.tokens
  state.originalTokens = state.originalTokensByTheme[state.theme] ?? new Map()
  state.issues = [...activeFlat.issues, ...parityIssues]
  state.usage = T.buildUsage(activeFlat.tokens)
  state.resolved = new Map([...activeFlat.tokens.values()].map((t) => [t.id, T.tryResolve(t, activeFlat.tokens)]))
  const { css, errors } = T.buildCss(lightFlat.tokens, darkFlat.tokens)
  state.css = css
  state.errors = errors
  state.errorsById = new Map(errors.map((e) => [e.id, e.message]))
  $('#token-css').textContent = css
}

let frame = 0
function changed() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    recompute()
    refreshUi()
  })
}

function refreshUi() {
  refreshRows()
  renderTabs()
  updateStatus()
  renderPreview($('#preview'), state)
}

// ---------------------------------------------------------------------------
// Candidate lookup for alias selects
// ---------------------------------------------------------------------------
function candidates(type, self, hint) {
  let list = [...state.tokens.values()].filter(
    (t) => t.type === type && t.id !== self.id && !T.dependsOn(t.id, self.id, state.tokens)
  )
  const narrow = (pred) => {
    const filtered = list.filter(pred)
    if (filtered.length) list = filtered
  }
  if (hint) narrow((t) => t.id.includes(hint))
  else narrow((t) => T.categoryOf(t.file) === T.categoryOf(self.file))
  // Lower tiers first: system tokens should point at global tokens
  const rank = (t) => (t.path[0] === self.path[0] ? 1 : 0)
  return list.sort((a, b) => rank(a) - rank(b))
}

function aliasSelect(currentValue, type, self, onChange, hint) {
  const ref = T.refOf(currentValue)
  const select = h('select', { title: ref ? `{${ref}}` : '' })
  const groups = new Map()
  for (const t of candidates(type, self, hint)) {
    const parent = t.path.slice(0, -1).join('.')
    if (!groups.has(parent)) groups.set(parent, [])
    groups.get(parent).push(t)
  }
  if (ref && !state.tokens.has(ref)) {
    select.append(h('option', { value: ref }, `⚠ {${ref}}（不存在）`))
  }
  for (const [parent, list] of groups) {
    select.append(h('optgroup', { label: parent },
      list.map((t) => {
        const r = state.resolved.get(t.id)
        const preview = r?.error ? '⚠' : T.formatValue(type, r?.value)
        return h('option', { value: t.id }, `${t.path.at(-1)}  —  ${preview}`)
      })))
  }
  select.append(h('option', { value: '__detach__' }, '⤷ 改為自訂值（解除引用）'))
  select.value = ref
  select.addEventListener('change', () => {
    if (select.value === '__detach__') {
      const r = state.resolved.get(ref) ?? (state.tokens.has(ref) ? T.tryResolve(state.tokens.get(ref), state.tokens) : {})
      if (r.error || r.value === undefined) {
        select.value = ref
        return toast('引用無法解析，無法轉為自訂值', true)
      }
      onChange(clone(r.value))
      renderEditor()
    } else {
      onChange(`{${select.value}}`)
      select.title = `{${select.value}}`
    }
  })
  return select
}

// ---------------------------------------------------------------------------
// Raw value controls
// ---------------------------------------------------------------------------
function numberPair({ value, min, max, step, onInput }) {
  const range = h('input', { type: 'range', min, max, step, value })
  const num = h('input', { type: 'number', step, value })
  range.addEventListener('input', () => { num.value = range.value; onInput(Number(range.value)) })
  num.addEventListener('input', () => {
    if (num.value === '' || Number.isNaN(Number(num.value))) return
    range.value = num.value
    onInput(Number(num.value))
  })
  return { range, num }
}

function dimensionControl(value, onChange, label) {
  let { value: num, unit } = T.parseDimension(value)
  const isObject = value && typeof value === 'object'
  // Preserve the original key order ({unit, value} vs {value, unit})
  const write = () => {
    if (!isObject) return onChange(`${num}${unit}`)
    const keys = Object.keys(value)
    onChange(Object.fromEntries(keys.map((k) => [k, k === 'unit' ? unit : k === 'value' ? num : value[k]])))
  }
  const isTime = unit === 'ms' || unit === 's'
  const bounds = () => {
    const abs = Math.abs(num)
    if (unit === 'ms') return { min: 0, max: Math.max(500, Math.ceil(abs * 2)), step: 5 }
    if (unit === 's') return { min: 0, max: Math.max(1, +(abs * 2).toFixed(2)), step: 0.05 }
    const max = unit === 'px' ? Math.max(16, Math.ceil(abs * 2.5)) : Math.max(0.1, +(abs * 2.5).toFixed(3))
    const step = unit === 'px' ? 1 : max <= 0.5 ? 0.005 : 0.0625
    return { min: num < 0 ? -max : 0, max, step }
  }
  const pair = numberPair({ value: num, ...bounds(), onInput: (n) => { num = n; write() } })
  const applyBounds = () => Object.assign(pair.range, bounds())
  pair.range.addEventListener('change', applyBounds)
  pair.num.addEventListener('change', applyBounds)

  const units = isTime ? ['ms', 's'] : ['px', 'rem']
  if (!units.includes(unit)) units.push(unit)
  const unitSelect = h('select', { class: 'unit-select' }, units.map((u) => h('option', { value: u }, u)))
  unitSelect.value = unit
  unitSelect.addEventListener('change', () => {
    const next = unitSelect.value
    if (unit === 'px' && next === 'rem') num = +(num / 16).toFixed(4)
    else if (unit === 'rem' && next === 'px') num = +(num * 16).toFixed(2)
    else if (unit === 'ms' && next === 's') num = +(num / 1000).toFixed(3)
    else if (unit === 's' && next === 'ms') num = Math.round(num * 1000)
    unit = next
    pair.num.value = num
    applyBounds()
    pair.range.value = num
    write()
  })
  return control(label, pair.range, pair.num, unitSelect)
}

function colorRawControl(value, onChange, label) {
  const hex = C.colorValueToHex(value)
  const picker = h('input', { type: 'color', class: 'color-input', value: hex })
  const text = h('input', { type: 'text', value: hex, class: 'mono', spellcheck: false, style: 'width:84px;flex:none' })
  let alpha = value && typeof value === 'object' && value.alpha !== undefined ? Number(value.alpha) : 1
  const hasAlpha = value && typeof value === 'object' && (value.alpha !== undefined && value.alpha < 1)
  const emit = (rgbHex) => {
    const rgb = C.hexToRgb(rgbHex)
    if (!rgb) return
    const normalized = C.rgbToHex(rgb)
    if (typeof value === 'string') return onChange(normalized)
    onChange({
      ...value,
      colorSpace: 'oklch',
      components: C.rgbToOklch(rgb),
      alpha,
      hex: normalized
    })
  }
  picker.addEventListener('input', () => { text.value = picker.value; emit(picker.value) })
  text.addEventListener('change', () => { if (C.hexToRgb(text.value)) picker.value = C.rgbToHex(C.hexToRgb(text.value)); emit(text.value) })
  if (!hasAlpha) return control(label, picker, text)
  const alphaPair = numberPair({
    value: alpha, min: 0, max: 1, step: 0.01,
    onInput: (a) => { alpha = a; emit(picker.value) }
  })
  return control(label, picker, text, h('span', { class: 'sub-label' }, 'α'), alphaPair.range, alphaPair.num)
}

const STROKE_STYLES = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'outset', 'inset']

function rawControl(type, value, onChange, label) {
  switch (type) {
    case 'color':
      return colorRawControl(value, onChange, label)
    case 'dimension':
    case 'duration':
      return dimensionControl(value, onChange, label)
    case 'number': {
      const n = Number(value)
      const { range, num } = numberPair({ value: n, min: 0, max: Math.max(3, Math.ceil(n * 2)), step: 0.01, onInput: onChange })
      return control(label, range, num)
    }
    case 'fontWeight': {
      const { range, num } = numberPair({ value: Number(value), min: 100, max: 900, step: 50, onInput: onChange })
      return control(label, range, num)
    }
    case 'fontFamily': {
      const text = h('input', { type: 'text', value: Array.isArray(value) ? value.join(', ') : value })
      text.addEventListener('input', () => {
        const list = text.value.split(',').map((s) => s.trim()).filter(Boolean)
        onChange(Array.isArray(value) ? list : list.join(', '))
      })
      return control(label, text)
    }
    case 'strokeStyle':
      if (typeof value === 'string') {
        const select = h('select', {}, STROKE_STYLES.map((s) => h('option', { value: s }, s)))
        select.value = value
        select.addEventListener('change', () => onChange(select.value))
        return control(label, select)
      }
    // falls through for composite stroke styles
    default: {
      const text = h('input', { type: 'text', class: 'mono', value: JSON.stringify(value) })
      text.addEventListener('change', () => {
        try { onChange(JSON.parse(text.value)); text.style.borderColor = '' } catch { text.style.borderColor = 'var(--ui-danger)' }
      })
      return control(label, text)
    }
  }
}

// ---------------------------------------------------------------------------
// Token rows
// ---------------------------------------------------------------------------
function valueControl(token) {
  const node = token.node
  const set = (v) => { node.$value = v; changed() }

  const compositeProps = token.type === 'typography'
    ? T.TYPOGRAPHY_PROPS
    : token.type === 'shadow'
      ? T.SHADOW_PROPS
      : null
  if (compositeProps && node.$value && typeof node.$value === 'object') {
    const wrap = h('div')
    for (const [prop, meta] of Object.entries(compositeProps)) {
      const current = node.$value[prop]
      if (current === undefined) continue
      const setProp = (v) => { node.$value[prop] = v; changed() }
      wrap.append(T.refOf(current)
        ? control(prop, aliasSelect(current, meta.type, token, setProp, meta.hint))
        : rawControl(meta.type, current, setProp, prop))
    }
    return wrap
  }
  if (T.refOf(node.$value)) return control(null, aliasSelect(node.$value, token.type, token, set))
  return rawControl(token.type, node.$value, set)
}

function linkToAlias(token) {
  const list = candidates(token.type, token)
  if (!list.length) return toast('沒有可引用的同類型 token', true)
  const current = state.resolved.get(token.id)?.value
  const match = list.find((t) => same(state.resolved.get(t.id)?.value, current)) ?? list[0]
  token.node.$value = `{${match.id}}`
  changed()
  renderEditor()
}

function resetToken(id) {
  const orig = state.originalTokens.get(id)
  const cur = state.tokens.get(id)
  if (!orig || !cur) return
  cur.node.$value = clone(orig.node.$value)
  changed()
  renderEditor()
}

function rowHead(token, { linkable = true } = {}) {
  const isAlias = !!T.refOf(token.node.$value)
  const name = h('code', { class: 'row-name', title: `${token.id}\n點擊複製 var(${T.cssName(token.path)})` }, token.path.at(-1))
  name.addEventListener('click', () => {
    navigator.clipboard?.writeText(`var(${T.cssName(token.path)})`)
    toast(`已複製 var(${T.cssName(token.path)})`)
  })
  return h('div', { class: 'row-head' },
    name,
    h('span', { class: 'badge' }, token.type ?? '?'),
    isAlias ? h('span', { class: 'badge alias' }, 'alias') : null,
    h('span', { class: 'usage', dataset: { usage: '' } }),
    linkable && !isAlias && token.type !== 'typography' && token.type !== 'shadow' && token.path[0] !== 'global'
      ? h('button', { class: 'icon-btn', title: '改為引用其他 token', onclick: () => linkToAlias(token) }, '🔗')
      : null,
    h('button', { class: 'icon-btn', title: '重設為檔案中的值', hidden: true, dataset: { reset: '' }, onclick: () => resetToken(token.id) }, '↺')
  )
}

function tokenRow(token) {
  return h('div', { class: 'row', dataset: { id: token.id } },
    rowHead(token),
    valueControl(token),
    h('div', { class: 'resolved', dataset: { resolved: '' } })
  )
}

// ---------------------------------------------------------------------------
// Palette widget (global colour ramps edited in OKLCH)
// ---------------------------------------------------------------------------
function setOklch(node, [L, C_, H]) {
  const comps = [round(L), round(Math.max(0, C_)), round(((H % 360) + 360) % 360)]
  const hex = C.oklchToHex(...comps)
  const prev = node.$value
  node.$value = typeof prev === 'string'
    ? hex
    : { ...prev, colorSpace: 'oklch', components: comps, alpha: prev?.alpha ?? 1, hex }
}

function lchGradients(L, Cv, H) {
  const hueStops = Array.from({ length: 13 }, (_, i) => `oklch(${L} ${Cv} ${i * 30})`).join(', ')
  return {
    L: `linear-gradient(to right, oklch(0 ${Cv} ${H}), oklch(0.5 ${Cv} ${H}), oklch(1 ${Cv} ${H}))`,
    C: `linear-gradient(to right, oklch(${L} 0 ${H}), oklch(${L} 0.37 ${H}))`,
    H: `linear-gradient(to right, ${hueStops})`
  }
}

function shadeEditor(token) {
  const node = token.node
  const [L0, C0, H0] = C.colorValueToOklch(node.$value)
  const lch = [L0, C0, H0]
  const specs = [
    { key: 'L', min: 0, max: 1, step: 0.001 },
    { key: 'C', min: 0, max: 0.37, step: 0.001 },
    { key: 'H', min: 0, max: 360, step: 0.1 }
  ]
  const hexInput = h('input', { type: 'text', class: 'mono', value: C.colorValueToHex(node.$value), spellcheck: false, style: 'width:90px;flex:none' })
  const gamut = h('span', { class: 'warn-text' })
  const pills = h('div', { class: 'contrast-row' })
  const sliders = []

  const sync = (skipInputs = false) => {
    const g = lchGradients(...lch)
    sliders.forEach(({ key, range, num }, i) => {
      range.style.background = g[key]
      if (!skipInputs) { range.value = lch[i]; num.value = lch[i] }
    })
    hexInput.value = C.oklchToHex(...lch)
    gamut.textContent = C.oklchToRgb(...lch).inGamut ? '' : '⚠ 超出 sRGB 色域，HEX 為裁切後的近似值'
    pills.replaceChildren(...[['#ffffff', 'W'], ['#000000', 'B']].map(([bg, letter]) => {
      const lc = apcaContrast(node.$value, bg)
      const apca = apcaLevel(lc)
      const ratio = contrast(node.$value, bg)
      const wcag = wcagLevel(ratio)
      return h('span', { class: 'contrast-pill', title: `與 ${bg} 的對比 — APCA: Lc ${lc.toFixed(1)} (${apca.usage}) · WCAG 2.1: ${ratio.toFixed(2)}:1 (${wcag})` },
        h('span', { class: 'sample', style: `background:${bg};color:${hexInput.value}` }, letter),
        `Lc ${Math.abs(lc).toFixed(1)} `, h('b', { class: `level-${apca.css}` }, apca.tier),
        h('small', { style: 'color:var(--ui-muted);margin-left:2px' }, `(${ratio.toFixed(2)})`))
    }))
  }

  specs.forEach((spec, i) => {
    const { range, num } = numberPair({
      value: lch[i], min: spec.min, max: spec.max, step: spec.step,
      onInput: (n) => { lch[i] = n; setOklch(node, lch); sync(true); changed() }
    })
    num.style.width = '80px'
    sliders.push({ key: spec.key, range, num })
  })

  hexInput.addEventListener('change', () => {
    const rgb = C.hexToRgb(hexInput.value)
    if (!rgb) return toast('HEX 格式錯誤', true)
    lch.splice(0, 3, ...C.rgbToOklch(rgb))
    setOklch(node, lch)
    sync()
    changed()
  })

  sync()
  return h('div', { class: 'row', dataset: { id: token.id } },
    rowHead(token, { linkable: false }),
    ...sliders.map(({ key, range, num }) => h('div', { class: 'lch-slider' }, h('label', {}, key), range, num)),
    h('div', { class: 'control', style: 'margin-top:8px' }, h('span', { class: 'sub-label' }, 'hex'), hexInput, gamut),
    pills,
    h('div', { class: 'resolved', dataset: { resolved: '' } })
  )
}

function paletteTools(list, rerenderBody) {
  // Relative adjustments applied to a snapshot taken when dragging starts
  const tool = (label, min, max, step, neutral, apply) => {
    let snapshot = null
    const range = h('input', { type: 'range', min, max, step, value: neutral })
    const out = h('code', { style: 'width:52px;text-align:right' }, '')
    range.addEventListener('input', () => {
      snapshot ??= list.map((t) => C.colorValueToOklch(t.node.$value))
      const amount = Number(range.value)
      out.textContent = amount === neutral ? '' : (amount > neutral && neutral === 0 ? '+' : '') + amount
      list.forEach((t, i) => setOklch(t.node, apply(snapshot[i], amount)))
      rerenderBody()
      changed()
    })
    range.addEventListener('change', () => { snapshot = null; range.value = neutral; out.textContent = '' })
    return control(label, range, out)
  }
  return h('div', { class: 'palette-tools' },
    tool('Hue 位移', -60, 60, 1, 0, ([L, Cv, H], d) => [L, Cv, H + d]),
    tool('Chroma 倍率', 0, 2, 0.01, 1, ([L, Cv, H], k) => [L, Cv * k, H]),
    tool('Lightness 位移', -0.1, 0.1, 0.005, 0, ([L, Cv, H], d) => [Math.min(1, Math.max(0, L + d)), Cv, H]),
    h('small', { style: 'color:var(--ui-muted)' }, '放開滑桿後會套用並歸零，可重複微調整組色階')
  )
}

function paletteWidget(parentId, list) {
  const wrap = h('div', { class: 'palette', dataset: { palette: parentId } })
  if (state.paletteTools.has(parentId)) wrap.classList.add('show-tools')
  const selectedId = () => {
    const id = state.selectedShade[parentId]
    return list.some((t) => t.id === id) ? id : list[Math.floor((list.length - 1) / 2)].id
  }
  const body = h('div', { class: 'palette-body' })
  const renderBody = () => body.replaceChildren(shadeEditor(list.find((t) => t.id === selectedId())))

  const strip = h('div', { class: 'palette-strip' }, list.map((t) =>
    h('button', {
      style: `background:var(${T.cssName(t.path)})`,
      title: t.id,
      dataset: { swatch: t.id },
      onclick: () => {
        state.selectedShade[parentId] = t.id
        $$('button', strip).forEach((b) => b.classList.toggle('selected', b.dataset.swatch === t.id))
        renderBody()
        refreshRows()
      }
    }, t.path.at(-1))))
  $$('button', strip).forEach((b) => b.classList.toggle('selected', b.dataset.swatch === selectedId()))

  const toggle = h('button', {
    class: 'icon-btn',
    title: '整組調整 Hue / Chroma / Lightness',
    onclick: () => {
      wrap.classList.toggle('show-tools')
      state.paletteTools[wrap.classList.contains('show-tools') ? 'add' : 'delete'](parentId)
    }
  }, '⚙ 整組調整')

  const usageCount = list.reduce((n, t) => n + (state.usage.get(t.id)?.length ?? 0), 0)
  wrap.append(
    h('div', { class: 'palette-head' },
      h('strong', {}, parentId.split('.').slice(1).join('.')),
      h('span', { class: 'usage' }, usageCount ? `被引用 ${usageCount} 次` : ''),
      toggle),
    strip,
    paletteTools(list, renderBody),
    body
  )
  renderBody()
  return wrap
}

// ---------------------------------------------------------------------------
// Editor panel
// ---------------------------------------------------------------------------
function matchesQuery(token) {
  if (!state.query) return true
  const q = state.query.toLowerCase()
  return token.id.toLowerCase().includes(q) || T.cssName(token.path).includes(q)
}

function renderEditor() {
  const editor = $('#editor')
  const scroll = editor.scrollTop
  editor.replaceChildren()

  const files = Object.keys(state.files)
    .filter((f) => T.categoryOf(f) === state.category && (!T.themeOf(f) || T.themeOf(f) === state.theme))
    .sort((a, b) => {
      const ia = LEVEL_ORDER.indexOf(T.levelOf(a))
      const ib = LEVEL_ORDER.indexOf(T.levelOf(b))
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b)
    })

  let shown = 0
  for (const file of files) {
    if (state.level !== 'all' && T.levelOf(file) !== state.level) continue
    const fileTokens = [...state.tokens.values()].filter((t) => t.file === file)
    const groups = new Map()
    for (const t of fileTokens) {
      const parent = t.path.slice(0, -1).join('.')
      if (!groups.has(parent)) groups.set(parent, [])
      groups.get(parent).push(t)
    }

    const themeTag = T.themeOf(file) ? ` · ${T.themeOf(file)}` : ''
    const section = h('section', { class: 'file-section' },
      h('div', { class: 'file-header' }, h('h3', {}, `${T.levelOf(file)}${themeTag}`), h('code', {}, file)))
    let sectionCount = 0

    for (const [parent, list] of groups) {
      const visible = list.filter(matchesQuery)
      if (!visible.length) continue
      const isPalette = list.length >= 3 && list.every((t) => t.type === 'color' && !T.refOf(t.node.$value) && (t.node.$value?.alpha ?? 1) === 1)
      if (isPalette) {
        if (visible.length === 1) state.selectedShade[parent] ??= visible[0].id
        section.append(paletteWidget(parent, list))
      } else {
        section.append(h('div', { class: 'group-title' }, parent.split('.').slice(1).join('.') || parent))
        visible.forEach((t) => section.append(tokenRow(t)))
      }
      sectionCount += visible.length
    }
    if (sectionCount) { editor.append(section); shown += sectionCount }
  }

  if (!shown) editor.append(h('div', { class: 'empty' }, state.query ? `找不到符合「${state.query}」的 token` : '這個分類沒有 token'))
  editor.scrollTop = scroll
  refreshRows()
}

function refreshRows() {
  for (const row of $$('#editor .row[data-id]')) {
    const id = row.dataset.id
    const token = state.tokens.get(id)
    if (!token) continue
    const r = state.resolved.get(id) ?? {}
    const error = r.error ?? state.errorsById.get(id)
    const dirty = tokenDirty(id)
    row.classList.toggle('dirty', dirty)
    row.classList.toggle('has-error', !!error)
    const reset = $('[data-reset]', row)
    if (reset) reset.hidden = !dirty

    const users = state.usage.get(id) ?? []
    const usage = $('[data-usage]', row)
    if (usage) {
      usage.textContent = users.length ? `被引用 ${users.length}` : ''
      usage.title = users.join('\n')
    }

    const out = $('[data-resolved]', row)
    if (!out) continue
    out.classList.toggle('error', !!error)
    if (error) { out.replaceChildren(`⚠ ${error}`); continue }
    const ref = T.refOf(token.node.$value)
    const text = T.formatValue(token.type, r.value)
    out.replaceChildren(
      token.type === 'color' ? h('span', { class: 'swatch-mini', style: `background:${C.colorValueToCss(r.value)}` }) : '',
      ref ? `{${ref}} → ${text}` : text
    )
  }

  for (const sw of $$('#editor [data-swatch]')) {
    const id = sw.dataset.swatch
    sw.classList.toggle('dirty', tokenDirty(id))
    sw.style.color = readableOn(state.resolved.get(id)?.value)
  }
}

function renderTabs() {
  const cats = [...new Set(Object.keys(state.files).map(T.categoryOf))].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a)
    const ib = CATEGORY_ORDER.indexOf(b)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b)
  })
  state.category ??= cats[0]
  const dirty = new Set(dirtyFiles().map(T.categoryOf))
  $('#tabs').replaceChildren(...cats.map((cat) => {
    const count = [...state.tokens.values()].filter((t) => T.categoryOf(t.file) === cat).length
    return h('button', {
      class: `tab${cat === state.category ? ' active' : ''}`,
      role: 'tab',
      onclick: () => {
        state.category = cat
        renderTabs()
        $('#editor').scrollTop = 0
        renderEditor()
        $(`#pv-${cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, CATEGORY_LABELS[cat] ?? cat, h('span', { class: 'count' }, count), dirty.has(cat) ? h('span', { class: 'dot' }) : null)
  }))
}

function allIssues() {
  return [
    ...Object.entries(state.loadErrors).map(([file, message]) => ({ id: file, file, message: `JSON 解析失敗：${message}` })),
    ...state.issues,
    ...state.errors
  ]
}

function updateStatus() {
  const dirty = dirtyFiles()
  $('#status-line').textContent = `${state.tokens.size} tokens · ${Object.keys(state.files).length} 個檔案`
  const indicator = $('#dirty-indicator')
  indicator.hidden = !dirty.length
  indicator.textContent = `${dirty.length} 個檔案未儲存`
  indicator.title = dirty.join('\n')
  for (const id of ['#btn-save', '#btn-download', '#btn-reset']) $(id).disabled = !dirty.length

  const issues = allIssues()
  const chip = $('#btn-issues')
  chip.hidden = !issues.length
  chip.textContent = `⚠ ${issues.length} 個問題`
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
function setSidebarCollapsed(collapsed) {
  state.sidebarCollapsed = Boolean(collapsed)
  $('.layout')?.classList.toggle('sidebar-collapsed', state.sidebarCollapsed)
  const btn = $('#btn-toggle-sidebar')
  if (btn) {
    btn.setAttribute('aria-expanded', String(!state.sidebarCollapsed))
    btn.textContent = state.sidebarCollapsed ? '▶ 展開側欄' : '◀ 收合側欄'
  }
}

function jumpTo(id) {
  const token = state.tokens.get(id)
  if (!token) return
  if (state.sidebarCollapsed) setSidebarCollapsed(false)
  state.category = T.categoryOf(token.file)
  if (state.level !== 'all' && state.level !== T.levelOf(token.file)) {
    state.level = 'all'
    $('#level-filter').value = 'all'
  }
  if (state.query && !matchesQuery(token)) {
    state.query = ''
    $('#search').value = ''
  }
  state.selectedShade[token.path.slice(0, -1).join('.')] = id
  renderTabs()
  renderEditor()
  const target = $(`#editor .row[data-id="${CSS.escape(id)}"]`)
  if (target) {
    target.scrollIntoView({ block: 'center', behavior: 'smooth' })
    target.classList.remove('flash')
    void target.offsetWidth
    target.classList.add('flash')
  }
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------
async function save() {
  const dirty = dirtyFiles()
  if (!dirty.length) return
  if (state.errors.length && !confirm(`目前有 ${state.errors.length} 個 token 無法解析，仍要儲存嗎？`)) return
  try {
    const res = await fetch('/api/tokens', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: Object.fromEntries(dirty.map((f) => [f, state.files[f]])) })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? res.statusText)
    for (const f of dirty) state.original[f] = clone(state.files[f])
    state.originalTokensByTheme = {
      light: T.flatten(state.original, 'light').tokens,
      dark: T.flatten(state.original, 'dark').tokens
    }
    state.originalTokens = state.originalTokensByTheme[state.theme]
    refreshUi()
    toast(`已寫入 ${data.written.length} 個檔案`)
  // eslint-disable-next-line @stylistic/space-before-function-paren
  } catch (err) {
    toast(`儲存失敗：${err.message}`, true)
  }
}

function download() {
  for (const f of dirtyFiles()) {
    const blob = new Blob([T.stringifyTokens(state.files[f]) + '\n'], { type: 'application/json' })
    const a = h('a', { href: URL.createObjectURL(blob), download: f.replace(/^tokens\//, '').replaceAll('/', '-') })
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
}

function resetAll() {
  if (!confirm('捨棄所有尚未儲存的變更？')) return
  state.files = clone(state.original)
  recompute()
  renderEditor()
  refreshUi()
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
function bindChrome() {
  $('#search').addEventListener('input', (e) => { state.query = e.target.value.trim(); renderEditor() })
  $('#level-filter').addEventListener('change', (e) => { state.level = e.target.value; renderEditor() })
  $('#btn-save').addEventListener('click', save)
  $('#btn-download').addEventListener('click', download)
  $('#btn-reset').addEventListener('click', resetAll)

  $('#btn-css').addEventListener('click', () => { $('#css-output').textContent = state.css; $('#css-dialog').showModal() })
  $('#btn-copy-css').addEventListener('click', async() => {
    await navigator.clipboard.writeText(state.css)
    toast('已複製 CSS')
  })
  $('#btn-issues').addEventListener('click', () => {
    $('#issues-list').replaceChildren(...allIssues().map((issue) => {
      const code = h('code', {}, issue.id)
      code.addEventListener('click', () => { $('#issues-dialog').close(); jumpTo(issue.id) })
      return h('li', {}, code, ` ${issue.message}`, h('small', {}, issue.file ?? ''))
    }))
    $('#issues-dialog').showModal()
  })
  $$('[data-close]').forEach((btn) => btn.addEventListener('click', () => btn.closest('dialog').close()))

  $('#btn-toggle-sidebar')?.addEventListener('click', () => {
    setSidebarCollapsed(!state.sidebarCollapsed)
  })

  $$('[data-canvas]').forEach((btn) => btn.addEventListener('click', () => {
    $$('[data-canvas]').forEach((b) => b.classList.toggle('active', b === btn))
    $('#preview').dataset.canvas = btn.dataset.canvas
    state.theme = btn.dataset.canvas
    recompute()
    renderEditor()
    refreshUi()
  }))
  $('#preview').addEventListener('click', (e) => {
    const contrastBtn = e.target.closest('[data-swatch-contrast]')
    if (contrastBtn) {
      state.swatchContrastMode = contrastBtn.dataset.swatchContrast
      renderPreview($('#preview'), state)
      return
    }
    const target = e.target.closest('[data-jump]')
    if (target && !e.target.closest('input')) jumpTo(target.dataset.jump)
  })

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save() }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault()
      setSidebarCollapsed(!state.sidebarCollapsed)
    }
  })
  window.addEventListener('beforeunload', (e) => { if (dirtyFiles().length) e.preventDefault() })
}

async function boot() {
  bindChrome()
  try {
    const res = await fetch('/api/tokens')
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    const data = await res.json()
    state.files = data.files
    state.loadErrors = data.errors ?? {}
    state.original = clone(data.files)
    state.originalTokensByTheme = {
      light: T.flatten(state.original, 'light').tokens,
      dark: T.flatten(state.original, 'dark').tokens
    }
    state.originalTokens = state.originalTokensByTheme[state.theme]
  // eslint-disable-next-line @stylistic/space-before-function-paren
  } catch (err) {
    $('#status-line').textContent = '載入失敗'
    $('#editor').replaceChildren(h('div', { class: 'empty' },
      '無法讀取 tokens，請以 ', h('code', {}, 'pnpm playground'), ' 啟動本機伺服器後再開啟此頁。', h('br'), String(err.message)))
    return
  }
  recompute()
  renderTabs()
  renderEditor()
  refreshUi()
}

boot()
