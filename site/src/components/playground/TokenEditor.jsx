import { useEffect, useRef, useState } from 'react'
import * as C from 'pact-design/utils/color.js'
import { apcaContrast, apcaLevel, contrast, readableOn, wcagLevel } from 'pact-design/utils/contrast.js'
import { clone, round, same } from 'pact-design/utils/helper.js'
import * as T from 'pact-design/utils/token.js'
import { Button } from '@pact-design/react'

export const CATEGORY_LABELS = {
  color: '色彩',
  typography: '字體',
  spacing: '間距',
  sizing: '尺寸',
  border: '邊框',
  elevation: '陰影',
  motion: '動態'
}

export const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS)
const LEVEL_ORDER = ['global', 'system', 'component']
const STROKE_STYLES = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'outset', 'inset']

const INPUT_CLASS = [
  'h-control-xs px-xs rounded-2xs',
  'bg-layer-1 text-on-surface text-body-xs',
  'border-sm border-border-default outline-none',
  'focus:border-border-focus'
].join(' ')

const SELECT_CLASS = [
  'h-control-xs px-2xs rounded-2xs flex-1 min-w-0',
  'bg-layer-1 text-on-surface text-body-xs',
  'border-sm border-border-default outline-none cursor-pointer',
  'focus:border-border-focus'
].join(' ')

function candidatesFor(type, self, hint, tokens) {
  let list = [...tokens.values()].filter(
    (t) => t.type === type && t.id !== self.id && !T.dependsOn(t.id, self.id, tokens)
  )
  const narrow = (pred) => {
    const filtered = list.filter(pred)
    if (filtered.length) list = filtered
  }
  if (hint) narrow((t) => t.id.includes(hint))
  else narrow((t) => T.categoryOf(t.file) === T.categoryOf(self.file))
  const rank = (t) => (t.path[0] === self.path[0] ? 1 : 0)
  return list.sort((a, b) => rank(a) - rank(b))
}

function setOklchOnNode(node, [L, Cv, H]) {
  const comps = [round(L), round(Math.max(0, Cv)), round(((H % 360) + 360) % 360)]
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

export function apcaBadgeClasses(cssTier) {
  switch (cssTier) {
    case 'Lc-90':
    case 'Lc-75':
      return 'bg-success-subtle text-on-success-subtle border-success-border'
    case 'Lc-60':
      return 'bg-info-subtle text-on-info-subtle border-info-border'
    case 'Lc-45':
    case 'Lc-30':
      return 'bg-warning-subtle text-on-warning-subtle border-warning-border'
    default:
      return 'bg-danger-subtle text-on-danger-subtle border-danger-border'
  }
}

function AliasSelect({ currentValue, type, self, hint, tokens, resolved, onChange, onToast }) {
  const ref = T.refOf(currentValue) || ''
  const list = candidatesFor(type, self, hint, tokens)
  const groups = new Map()
  for (const t of list) {
    const parent = t.path.slice(0, -1).join('.')
    if (!groups.has(parent)) groups.set(parent, [])
    groups.get(parent).push(t)
  }

  const handleChange = (e) => {
    const nextVal = e.target.value
    if (nextVal === '__detach__') {
      const r = resolved.get(ref) ?? (tokens.has(ref) ? T.tryResolve(tokens.get(ref), tokens) : {})
      if (r.error || r.value === undefined) {
        onToast('引用無法解析，無法轉為自訂值', true)
        return
      }
      onChange(clone(r.value))
    } else {
      onChange(`{${nextVal}}`)
    }
  }

  return (
    <select
      className={SELECT_CLASS}
      title={ref ? `{${ref}}` : ''}
      value={ref}
      onChange={handleChange}
    >
      {ref && !tokens.has(ref) && (
        <option value={ref}>⚠ {`{${ref}}`}（不存在）</option>
      )}
      {[...groups.entries()].map(([parent, items]) => (
        <optgroup key={parent} label={parent}>
          {items.map((t) => {
            const r = resolved.get(t.id)
            const preview = r?.error ? '⚠' : T.formatValue(type, r?.value)
            return (
              <option key={t.id} value={t.id}>
                {t.path.at(-1)} — {preview}
              </option>
            )
          })}
        </optgroup>
      ))}
      <option value="__detach__">⤷ 改為自訂值（解除引用）</option>
    </select>
  )
}

function DimensionControl({ value, onChange, label }) {
  const parsed = T.parseDimension(value)
  const isObject = value && typeof value === 'object'
  const num = parsed.value
  const unit = parsed.unit
  const isTime = unit === 'ms' || unit === 's'

  const getBounds = (currentNum, currentUnit) => {
    const abs = Math.abs(currentNum)
    if (currentUnit === 'ms') return { min: 0, max: Math.max(500, Math.ceil(abs * 2)), step: 5 }
    if (currentUnit === 's') return { min: 0, max: Math.max(1, +(abs * 2).toFixed(2)), step: 0.05 }
    const max = currentUnit === 'px' ? Math.max(16, Math.ceil(abs * 2.5)) : Math.max(0.1, +(abs * 2.5).toFixed(3))
    const step = currentUnit === 'px' ? 1 : max <= 0.5 ? 0.005 : 0.0625
    return { min: currentNum < 0 ? -max : 0, max, step }
  }

  const [bounds, setBounds] = useState(() => getBounds(num, unit))

  const emit = (nextNum, nextUnit) => {
    if (!isObject) {
      onChange(`${nextNum}${nextUnit}`)
      return
    }
    const keys = Object.keys(value)
    onChange(
      Object.fromEntries(
        keys.map((k) => [k, k === 'unit' ? nextUnit : k === 'value' ? nextNum : value[k]])
      )
    )
  }

  const handleUnitChange = (e) => {
    const nextUnit = e.target.value
    let nextNum = num
    if (unit === 'px' && nextUnit === 'rem') nextNum = +(num / 16).toFixed(4)
    else if (unit === 'rem' && nextUnit === 'px') nextNum = +(num * 16).toFixed(2)
    else if (unit === 'ms' && nextUnit === 's') nextNum = +(num / 1000).toFixed(3)
    else if (unit === 's' && nextUnit === 'ms') nextNum = Math.round(num * 1000)
    setBounds(getBounds(nextNum, nextUnit))
    emit(nextNum, nextUnit)
  }

  const units = isTime ? ['ms', 's'] : ['px', 'rem']
  if (!units.includes(unit)) units.push(unit)

  return (
    <div className="flex items-center gap-2xs">
      {label && <span className="text-caption-sm text-on-surface-muted min-w-16 shrink-0">{label}</span>}
      <input
        type="range"
        className="flex-1 min-w-12 accent-primary cursor-pointer"
        min={bounds.min}
        max={bounds.max}
        step={bounds.step}
        value={num}
        onChange={(e) => emit(Number(e.target.value), unit)}
        onMouseUp={() => setBounds(getBounds(num, unit))}
      />
      <input
        type="number"
        className={`${INPUT_CLASS} w-18 text-mono-xs tabular-nums`}
        step={bounds.step}
        value={num}
        onChange={(e) => {
          if (e.target.value === '' || Number.isNaN(Number(e.target.value))) return
          emit(Number(e.target.value), unit)
        }}
        onBlur={() => setBounds(getBounds(num, unit))}
      />
      <select
        className={`${SELECT_CLASS} flex-none w-14 text-mono-xs`}
        value={unit}
        onChange={handleUnitChange}
      >
        {units.map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>
    </div>
  )
}

function ColorRawControl({ value, onChange, label }) {
  const hex = C.colorValueToHex(value)
  const [textHex, setTextHex] = useState(hex)
  useEffect(() => {
    setTextHex(hex)
  }, [hex])

  const alpha = value && typeof value === 'object' && value.alpha !== undefined ? Number(value.alpha) : 1
  const hasAlpha = value && typeof value === 'object' && value.alpha !== undefined && value.alpha < 1

  const emit = (rgbHex, nextAlpha = alpha) => {
    const rgb = C.hexToRgb(rgbHex)
    if (!rgb) return
    const normalized = C.rgbToHex(rgb)
    if (typeof value === 'string') {
      onChange(normalized)
      return
    }
    onChange({
      ...value,
      colorSpace: 'oklch',
      components: C.rgbToOklch(rgb),
      alpha: nextAlpha,
      hex: normalized
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2xs">
      {label && <span className="text-caption-sm text-on-surface-muted min-w-16 shrink-0">{label}</span>}
      <input
        type="color"
        className="w-control-xs h-control-xs p-0 border-sm border-border-default rounded-2xs cursor-pointer bg-transparent shrink-0"
        value={hex}
        onChange={(e) => {
          setTextHex(e.target.value)
          emit(e.target.value)
        }}
      />
      <input
        type="text"
        spellCheck={false}
        className={`${INPUT_CLASS} w-22 text-mono-xs`}
        value={textHex}
        onChange={(e) => setTextHex(e.target.value)}
        onBlur={() => {
          if (C.hexToRgb(textHex)) {
            emit(textHex)
          } else {
            setTextHex(hex)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && C.hexToRgb(textHex)) {
            emit(textHex)
          }
        }}
      />
      {hasAlpha && (
        <>
          <span className="text-caption-sm text-on-surface-muted ml-2xs">α</span>
          <input
            type="range"
            className="flex-1 min-w-12 accent-primary cursor-pointer"
            min={0}
            max={1}
            step={0.01}
            value={alpha}
            onChange={(e) => emit(hex, Number(e.target.value))}
          />
          <input
            type="number"
            className={`${INPUT_CLASS} w-16 text-mono-xs tabular-nums`}
            min={0}
            max={1}
            step={0.01}
            value={alpha}
            onChange={(e) => {
              if (e.target.value === '' || Number.isNaN(Number(e.target.value))) return
              emit(hex, Number(e.target.value))
            }}
          />
        </>
      )}
    </div>
  )
}

function RawControl({ type, value, onChange, label }) {
  if (type === 'color') {
    return <ColorRawControl value={value} onChange={onChange} label={label} />
  }
  if (type === 'dimension' || type === 'duration') {
    return <DimensionControl value={value} onChange={onChange} label={label} />
  }
  if (type === 'number') {
    const n = Number(value)
    const max = Math.max(3, Math.ceil(n * 2))
    return (
      <div className="flex items-center gap-2xs">
        {label && <span className="text-caption-sm text-on-surface-muted min-w-16 shrink-0">{label}</span>}
        <input
          type="range"
          className="flex-1 min-w-12 accent-primary cursor-pointer"
          min={0}
          max={max}
          step={0.01}
          value={n}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <input
          type="number"
          className={`${INPUT_CLASS} w-18 text-mono-xs tabular-nums`}
          step={0.01}
          value={n}
          onChange={(e) => {
            if (e.target.value === '' || Number.isNaN(Number(e.target.value))) return
            onChange(Number(e.target.value))
          }}
        />
      </div>
    )
  }
  if (type === 'fontWeight') {
    const n = Number(value)
    return (
      <div className="flex items-center gap-2xs">
        {label && <span className="text-caption-sm text-on-surface-muted min-w-16 shrink-0">{label}</span>}
        <input
          type="range"
          className="flex-1 min-w-12 accent-primary cursor-pointer"
          min={100}
          max={900}
          step={50}
          value={n}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <input
          type="number"
          className={`${INPUT_CLASS} w-18 text-mono-xs tabular-nums`}
          min={100}
          max={900}
          step={50}
          value={n}
          onChange={(e) => {
            if (e.target.value === '' || Number.isNaN(Number(e.target.value))) return
            onChange(Number(e.target.value))
          }}
        />
      </div>
    )
  }
  if (type === 'fontFamily') {
    const strVal = Array.isArray(value) ? value.join(', ') : String(value ?? '')
    return (
      <div className="flex items-center gap-2xs">
        {label && <span className="text-caption-sm text-on-surface-muted min-w-16 shrink-0">{label}</span>}
        <input
          type="text"
          className={`${INPUT_CLASS} flex-1 min-w-0`}
          value={strVal}
          onChange={(e) => {
            const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
            onChange(Array.isArray(value) ? list : list.join(', '))
          }}
        />
      </div>
    )
  }
  if (type === 'strokeStyle' && typeof value === 'string') {
    return (
      <div className="flex items-center gap-2xs">
        {label && <span className="text-caption-sm text-on-surface-muted min-w-16 shrink-0">{label}</span>}
        <select
          className={SELECT_CLASS}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {STROKE_STYLES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    )
  }

  return <JsonRawControl value={value} onChange={onChange} label={label} />
}

function JsonRawControl({ value, onChange, label }) {
  const [text, setText] = useState(() => JSON.stringify(value))
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    setText(JSON.stringify(value))
    setInvalid(false)
  }, [value])

  return (
    <div className="flex items-center gap-2xs">
      {label && <span className="text-caption-sm text-on-surface-muted min-w-16 shrink-0">{label}</span>}
      <input
        type="text"
        className={`${INPUT_CLASS} flex-1 min-w-0 text-mono-xs ${invalid ? 'border-danger' : ''}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          try {
            onChange(JSON.parse(text))
            setInvalid(false)
          } catch {
            setInvalid(true)
          }
        }}
      />
    </div>
  )
}

function RowHeader({
  token,
  linkable = true,
  isDirty,
  users,
  onLinkToAlias,
  onResetToken,
  onToast
}) {
  const isAlias = !!T.refOf(token.node.$value)
  const cssVar = `var(${T.cssName(token.path)})`

  const handleCopy = () => {
    navigator.clipboard?.writeText(cssVar)
    onToast(`已複製 ${cssVar}`)
  }

  return (
    <div className="flex items-center gap-2xs flex-wrap">
      <button
        type="button"
        onClick={handleCopy}
        title={`${token.id}\n點擊複製 ${cssVar}`}
        className="text-mono-xs font-semibold text-on-surface hover:text-primary cursor-pointer bg-transparent border-none p-0 text-left"
      >
        {token.path.at(-1)}
      </button>
      <span className="text-caption-sm px-2xs rounded-2xs bg-layer-1 text-on-surface-muted border-sm border-border-subtle">
        {token.type ?? '?'}
      </span>
      {isAlias && (
        <span className="text-caption-sm px-2xs rounded-2xs bg-info-subtle text-on-info-subtle border-sm border-info-border">
          alias
        </span>
      )}
      {users.length > 0 && (
        <span
          className="text-caption-sm text-on-surface-muted ml-auto"
          title={users.join('\n')}
        >
          被引用 {users.length}
        </span>
      )}
      <div className={`flex items-center gap-3xs ${users.length > 0 ? '' : 'ml-auto'}`}>
        {linkable && !isAlias && token.type !== 'typography' && token.type !== 'shadow' && token.path[0] !== 'global' && (
          <button
            type="button"
            title="改為引用其他 token"
            onClick={() => onLinkToAlias(token)}
            className="px-2xs py-3xs rounded-2xs text-caption-sm bg-layer-1 hover:bg-layer-1-hover text-on-surface-secondary border-sm border-border-default cursor-pointer"
          >
            🔗
          </button>
        )}
        {isDirty && (
          <button
            type="button"
            title="重設為檔案中的值"
            onClick={() => onResetToken(token.id)}
            className="px-2xs py-3xs rounded-2xs text-caption-sm bg-warning-subtle hover:bg-warning text-on-warning-subtle hover:text-on-warning border-sm border-warning-border cursor-pointer"
          >
            ↺
          </button>
        )}
      </div>
    </div>
  )
}

function ResolvedFooter({ token, resolvedEntry, errorMsg }) {
  const error = resolvedEntry?.error ?? errorMsg
  if (error) {
    return (
      <div className="text-caption-sm text-on-danger-subtle bg-danger-subtle px-2xs py-3xs rounded-2xs border-sm border-danger-border">
        ⚠ {error}
      </div>
    )
  }

  const ref = T.refOf(token.node.$value)
  const text = T.formatValue(token.type, resolvedEntry?.value)

  return (
    <div className="flex items-center gap-2xs text-mono-xs text-on-surface-muted truncate">
      {token.type === 'color' && (
        <span
          className="inline-block w-3 h-3 rounded-2xs border-sm border-border-default shrink-0"
          style={{ background: C.colorValueToCss(resolvedEntry?.value) }}
        />
      )}
      <span className="truncate">{ref ? `{${ref}} → ${text}` : text}</span>
    </div>
  )
}

function TokenRow({
  token,
  tokens,
  resolved,
  errorsById,
  usage,
  isDirty,
  isFlashed,
  onMutate,
  onLinkToAlias,
  onResetToken,
  onToast
}) {
  const node = token.node
  const setVal = (v) => {
    node.$value = v
    onMutate()
  }

  const compositeProps = token.type === 'typography'
    ? T.TYPOGRAPHY_PROPS
    : token.type === 'shadow'
      ? T.SHADOW_PROPS
      : null

  const users = usage.get(token.id) ?? []
  const resolvedEntry = resolved.get(token.id)
  const errorMsg = errorsById.get(token.id)
  const hasError = !!(resolvedEntry?.error || errorMsg)

  return (
    <div
      data-id={token.id}
      className={[
        'flex flex-col gap-2xs p-xs rounded-xs border-sm transition-colors duration-fast',
        hasError
          ? 'bg-danger-subtle border-danger-border'
          : isFlashed
            ? 'bg-info-subtle border-primary ring-md ring-primary'
            : isDirty
              ? 'bg-layer-2 border-warning-border'
              : 'bg-layer-2 border-border-subtle'
      ].join(' ')}
    >
      <RowHeader
        token={token}
        linkable
        isDirty={isDirty}
        users={users}
        onLinkToAlias={onLinkToAlias}
        onResetToken={onResetToken}
        onToast={onToast}
      />

      {compositeProps && node.$value && typeof node.$value === 'object' ? (
        <div className="flex flex-col gap-2xs">
          {Object.entries(compositeProps).map(([prop, meta]) => {
            const current = node.$value[prop]
            if (current === undefined) return null
            const setProp = (v) => {
              node.$value[prop] = v
              onMutate()
            }
            return T.refOf(current) ? (
              <div key={prop} className="flex items-center gap-2xs">
                <span className="text-caption-sm text-on-surface-muted min-w-16 shrink-0">{prop}</span>
                <AliasSelect
                  currentValue={current}
                  type={meta.type}
                  self={token}
                  hint={meta.hint}
                  tokens={tokens}
                  resolved={resolved}
                  onChange={setProp}
                  onToast={onToast}
                />
              </div>
            ) : (
              <RawControl
                key={prop}
                type={meta.type}
                value={current}
                onChange={setProp}
                label={prop}
              />
            )
          })}
        </div>
      ) : T.refOf(node.$value) ? (
        <AliasSelect
          currentValue={node.$value}
          type={token.type}
          self={token}
          tokens={tokens}
          resolved={resolved}
          onChange={setVal}
          onToast={onToast}
        />
      ) : (
        <RawControl
          type={token.type}
          value={node.$value}
          onChange={setVal}
        />
      )}

      <ResolvedFooter
        token={token}
        resolvedEntry={resolvedEntry}
        errorMsg={errorMsg}
      />
    </div>
  )
}

function ShadeEditor({
  token,
  resolved,
  errorsById,
  usage,
  isDirty,
  isFlashed,
  onMutate,
  onResetToken,
  onToast
}) {
  const node = token.node
  const [L, Cv, H] = C.colorValueToOklch(node.$value)
  const hex = C.colorValueToHex(node.$value)
  const [hexInput, setHexInput] = useState(hex)

  useEffect(() => {
    setHexInput(hex)
  }, [hex])

  const gradients = lchGradients(L, Cv, H)
  const inGamut = C.oklchToRgb(L, Cv, H).inGamut

  const specs = [
    { key: 'L', min: 0, max: 1, step: 0.001, val: L },
    { key: 'C', min: 0, max: 0.37, step: 0.001, val: Cv },
    { key: 'H', min: 0, max: 360, step: 0.1, val: H }
  ]

  const updateChannel = (index, nextNum) => {
    const nextLch = [L, Cv, H]
    nextLch[index] = nextNum
    setOklchOnNode(node, nextLch)
    onMutate()
  }

  const commitHex = () => {
    const rgb = C.hexToRgb(hexInput)
    if (!rgb) {
      onToast('HEX 格式錯誤', true)
      setHexInput(hex)
      return
    }
    setOklchOnNode(node, C.rgbToOklch(rgb))
    onMutate()
  }

  const users = usage.get(token.id) ?? []
  const resolvedEntry = resolved.get(token.id)
  const errorMsg = errorsById.get(token.id)

  return (
    <div
      data-id={token.id}
      className={[
        'flex flex-col gap-xs p-xs rounded-xs border-sm transition-colors duration-fast',
        isFlashed
          ? 'bg-info-subtle border-primary ring-md ring-primary'
          : isDirty
            ? 'bg-layer-1 border-warning-border'
            : 'bg-layer-1 border-border-subtle'
      ].join(' ')}
    >
      <RowHeader
        token={token}
        linkable={false}
        isDirty={isDirty}
        users={users}
        onLinkToAlias={() => {}}
        onResetToken={onResetToken}
        onToast={onToast}
      />

      {specs.map((spec, idx) => (
        <div key={spec.key} className="flex items-center gap-2xs">
          <label className="text-mono-xs font-semibold text-on-surface-secondary w-4 shrink-0">
            {spec.key}
          </label>
          <input
            type="range"
            min={spec.min}
            max={spec.max}
            step={spec.step}
            value={spec.val}
            onChange={(e) => updateChannel(idx, Number(e.target.value))}
            className="flex-1 min-w-12 h-2 rounded-xs appearance-none cursor-pointer border-sm border-border-default"
            style={{ background: gradients[spec.key] }}
          />
          <input
            type="number"
            min={spec.min}
            max={spec.max}
            step={spec.step}
            value={spec.val}
            onChange={(e) => {
              if (e.target.value === '' || Number.isNaN(Number(e.target.value))) return
              updateChannel(idx, Number(e.target.value))
            }}
            className={`${INPUT_CLASS} w-20 text-mono-xs tabular-nums`}
          />
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2xs pt-3xs">
        <span className="text-caption-sm text-on-surface-muted">hex</span>
        <input
          type="text"
          spellCheck={false}
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={commitHex}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitHex()
          }}
          className={`${INPUT_CLASS} w-24 text-mono-xs`}
        />
        {!inGamut && (
          <span className="text-caption-sm text-on-warning-subtle">
            ⚠ 超出 sRGB 色域，HEX 為裁切後的近似值
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2xs">
        {[['#ffffff', 'W'], ['#000000', 'B']].map(([bg, letter]) => {
          const lc = apcaContrast(node.$value, bg)
          const apca = apcaLevel(lc)
          const ratio = contrast(node.$value, bg)
          const wcag = wcagLevel(ratio)
          return (
            <span
              key={letter}
              title={`與 ${bg} 的對比 — APCA: Lc ${lc.toFixed(1)} (${apca.usage}) · WCAG 2.1: ${ratio.toFixed(2)}:1 (${wcag})`}
              className="inline-flex items-center gap-2xs px-2xs py-3xs rounded-2xs bg-layer-2 border-sm border-border-subtle text-mono-xs"
            >
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-2xs font-bold text-caption-sm border-sm border-border-default"
                style={{ background: bg, color: hex }}
              >
                {letter}
              </span>
              <span>Lc {Math.abs(lc).toFixed(1)}</span>
              <b className={`px-3xs rounded-2xs border-sm text-caption-sm ${apcaBadgeClasses(apca.css)}`}>
                {apca.tier}
              </b>
              <small className="text-on-surface-muted">({ratio.toFixed(2)})</small>
            </span>
          )
        })}
      </div>

      <ResolvedFooter
        token={token}
        resolvedEntry={resolvedEntry}
        errorMsg={errorMsg}
      />
    </div>
  )
}

function PaletteBatchTools({ list, onMutate }) {
  const snapshotRef = useRef(null)
  const [hueDelta, setHueDelta] = useState(0)
  const [chromaMult, setChromaMult] = useState(1)
  const [lightDelta, setLightDelta] = useState(0)

  const applyBatch = (amount, transformFn) => {
    if (!snapshotRef.current) {
      snapshotRef.current = list.map((t) => C.colorValueToOklch(t.node.$value))
    }
    list.forEach((t, i) => {
      setOklchOnNode(t.node, transformFn(snapshotRef.current[i], amount))
    })
    onMutate()
  }

  const releaseBatch = (resetFn) => {
    snapshotRef.current = null
    resetFn()
  }

  return (
    <div className="flex flex-col gap-2xs p-xs rounded-xs bg-layer-1 border-sm border-border-subtle">
      <div className="flex items-center gap-2xs">
        <span className="text-caption-sm text-on-surface-muted w-24 shrink-0">Hue 位移</span>
        <input
          type="range"
          min={-60}
          max={60}
          step={1}
          value={hueDelta}
          onChange={(e) => {
            const val = Number(e.target.value)
            setHueDelta(val)
            applyBatch(val, ([L, Cv, H], d) => [L, Cv, H + d])
          }}
          onMouseUp={() => releaseBatch(() => setHueDelta(0))}
          onTouchEnd={() => releaseBatch(() => setHueDelta(0))}
          className="flex-1 accent-primary cursor-pointer"
        />
        <code className="text-mono-xs text-on-surface w-12 text-right">
          {hueDelta === 0 ? '' : hueDelta > 0 ? `+${hueDelta}` : hueDelta}
        </code>
      </div>

      <div className="flex items-center gap-2xs">
        <span className="text-caption-sm text-on-surface-muted w-24 shrink-0">Chroma 倍率</span>
        <input
          type="range"
          min={0}
          max={2}
          step={0.01}
          value={chromaMult}
          onChange={(e) => {
            const val = Number(e.target.value)
            setChromaMult(val)
            applyBatch(val, ([L, Cv, H], k) => [L, Cv * k, H])
          }}
          onMouseUp={() => releaseBatch(() => setChromaMult(1))}
          onTouchEnd={() => releaseBatch(() => setChromaMult(1))}
          className="flex-1 accent-primary cursor-pointer"
        />
        <code className="text-mono-xs text-on-surface w-12 text-right">
          {chromaMult === 1 ? '' : `${chromaMult}x`}
        </code>
      </div>

      <div className="flex items-center gap-2xs">
        <span className="text-caption-sm text-on-surface-muted w-24 shrink-0">Lightness 位移</span>
        <input
          type="range"
          min={-0.1}
          max={0.1}
          step={0.005}
          value={lightDelta}
          onChange={(e) => {
            const val = Number(e.target.value)
            setLightDelta(val)
            applyBatch(val, ([L, Cv, H], d) => [Math.min(1, Math.max(0, L + d)), Cv, H])
          }}
          onMouseUp={() => releaseBatch(() => setLightDelta(0))}
          onTouchEnd={() => releaseBatch(() => setLightDelta(0))}
          className="flex-1 accent-primary cursor-pointer"
        />
        <code className="text-mono-xs text-on-surface w-12 text-right">
          {lightDelta === 0 ? '' : lightDelta > 0 ? `+${lightDelta}` : lightDelta}
        </code>
      </div>

      <small className="text-caption-sm text-on-surface-muted">
        放開滑桿後會套用並歸零，可重複微調整組色階
      </small>
    </div>
  )
}

function PaletteWidget({
  parentId,
  list,
  resolved,
  errorsById,
  usage,
  selectedShadeId,
  showTools,
  flashedId,
  isTokenDirty,
  onSelectShade,
  onToggleTools,
  onMutate,
  onResetToken,
  onToast
}) {
  const activeId = list.some((t) => t.id === selectedShadeId)
    ? selectedShadeId
    : list[Math.floor((list.length - 1) / 2)].id

  const activeToken = list.find((t) => t.id === activeId) ?? list[0]
  const usageCount = list.reduce((n, t) => n + (usage.get(t.id)?.length ?? 0), 0)

  return (
    <div
      data-palette={parentId}
      className="flex flex-col gap-xs p-xs rounded-xs bg-layer-2 border-sm border-border-default"
    >
      <div className="flex items-center justify-between gap-xs">
        <strong className="text-label-sm text-on-surface">
          {parentId.split('.').slice(1).join('.')}
        </strong>
        {usageCount > 0 && (
          <span className="text-caption-sm text-on-surface-muted">
            被引用 {usageCount} 次
          </span>
        )}
        <Button
          variant="secondary"
          size="xs"
          onClick={() => onToggleTools(parentId)}
          className="ml-auto"
        >
          ⚙ 整組調整
        </Button>
      </div>

      <div className="grid grid-cols-11 gap-3xs">
        {list.map((t) => {
          const isSelected = t.id === activeId
          const dirty = isTokenDirty(t.id)
          const fg = readableOn(resolved.get(t.id)?.value)
          return (
            <button
              key={t.id}
              type="button"
              data-swatch={t.id}
              title={t.id}
              onClick={() => onSelectShade(parentId, t.id)}
              style={{
                background: `var(${T.cssName(t.path)})`,
                color: fg
              }}
              className={[
                'relative h-7 rounded-2xs text-mono-xs flex items-center justify-center cursor-pointer border-sm transition-transform',
                isSelected
                  ? 'border-border-focus ring-sm ring-border-focus z-docked scale-105 font-bold'
                  : 'border-border-subtle hover:scale-105'
              ].join(' ')}
            >
              <span>{t.path.at(-1)}</span>
              {dirty && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-warning" />
              )}
            </button>
          )
        })}
      </div>

      {showTools && (
        <PaletteBatchTools list={list} onMutate={onMutate} />
      )}

      <ShadeEditor
        token={activeToken}
        resolved={resolved}
        errorsById={errorsById}
        usage={usage}
        isDirty={isTokenDirty(activeToken.id)}
        isFlashed={flashedId === activeToken.id}
        onMutate={onMutate}
        onResetToken={onResetToken}
        onToast={onToast}
      />
    </div>
  )
}

export function TokenEditor({
  files,
  tokens,
  originalTokens,
  resolved,
  errorsById,
  usage,
  theme,
  category,
  query,
  level,
  selectedShade,
  paletteTools,
  dirtyFilesList,
  flashedId,
  onSelectCategory,
  onQueryChange,
  onLevelChange,
  onSelectShade,
  onTogglePaletteTools,
  onMutate,
  onToast
}) {
  const categories = [...new Set(Object.keys(files).map(T.categoryOf))].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a)
    const ib = CATEGORY_ORDER.indexOf(b)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b)
  })

  const activeCategory = category ?? categories[0]
  const dirtyCategories = new Set(dirtyFilesList.map(T.categoryOf))

  const isTokenDirty = (id) => {
    const cur = tokens.get(id)
    const orig = originalTokens.get(id)
    return !orig || !cur || !same(cur.node.$value, orig.node.$value)
  }

  const handleLinkToAlias = (token) => {
    const list = candidatesFor(token.type, token, undefined, tokens)
    if (!list.length) {
      onToast('沒有可引用的同類型 token', true)
      return
    }
    const current = resolved.get(token.id)?.value
    const match = list.find((t) => same(resolved.get(t.id)?.value, current)) ?? list[0]
    token.node.$value = `{${match.id}}`
    onMutate()
  }

  const handleResetToken = (id) => {
    const orig = originalTokens.get(id)
    const cur = tokens.get(id)
    if (!orig || !cur) return
    cur.node.$value = clone(orig.node.$value)
    onMutate()
  }

  const matchesQuery = (token) => {
    if (!query) return true
    const q = query.toLowerCase()
    return token.id.toLowerCase().includes(q) || T.cssName(token.path).includes(q)
  }

  const matchingFiles = Object.keys(files)
    .filter((f) => T.categoryOf(f) === activeCategory && (!T.themeOf(f) || T.themeOf(f) === theme))
    .sort((a, b) => {
      const ia = LEVEL_ORDER.indexOf(T.levelOf(a))
      const ib = LEVEL_ORDER.indexOf(T.levelOf(b))
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b)
    })

  const fileSections = []
  for (const file of matchingFiles) {
    if (level !== 'all' && T.levelOf(file) !== level) continue
    const fileTokens = [...tokens.values()].filter((t) => t.file === file)
    const groups = new Map()
    for (const t of fileTokens) {
      const parent = t.path.slice(0, -1).join('.')
      if (!groups.has(parent)) groups.set(parent, [])
      groups.get(parent).push(t)
    }

    const groupBlocks = []
    for (const [parent, list] of groups) {
      const visible = list.filter(matchesQuery)
      if (!visible.length) continue
      const isPalette =
        list.length >= 3 &&
        list.every((t) => t.type === 'color' && !T.refOf(t.node.$value) && (t.node.$value?.alpha ?? 1) === 1)

      if (isPalette) {
        const shadeId = visible.length === 1 ? (selectedShade[parent] ?? visible[0].id) : selectedShade[parent]
        groupBlocks.push(
          <PaletteWidget
            key={parent}
            parentId={parent}
            list={list}
            resolved={resolved}
            errorsById={errorsById}
            usage={usage}
            selectedShadeId={shadeId}
            showTools={paletteTools.has(parent)}
            flashedId={flashedId}
            isTokenDirty={isTokenDirty}
            onSelectShade={onSelectShade}
            onToggleTools={onTogglePaletteTools}
            onMutate={onMutate}
            onResetToken={handleResetToken}
            onToast={onToast}
          />
        )
      } else {
        groupBlocks.push(
          <div key={parent} className="flex flex-col gap-2xs">
            <div className="text-label-xs text-on-surface-secondary uppercase tracking-wider pt-2xs">
              {parent.split('.').slice(1).join('.') || parent}
            </div>
            {visible.map((t) => (
              <TokenRow
                key={t.id}
                token={t}
                tokens={tokens}
                resolved={resolved}
                errorsById={errorsById}
                usage={usage}
                isDirty={isTokenDirty(t.id)}
                isFlashed={flashedId === t.id}
                onMutate={onMutate}
                onLinkToAlias={handleLinkToAlias}
                onResetToken={handleResetToken}
                onToast={onToast}
              />
            ))}
          </div>
        )
      }
    }

    if (groupBlocks.length > 0) {
      const themeTag = T.themeOf(file) ? ` · ${T.themeOf(file)}` : ''
      fileSections.push(
        <section key={file} className="flex flex-col gap-xs">
          <div className="flex items-center justify-between px-xs py-2xs rounded-2xs bg-layer-2 border-sm border-border-default">
            <h3 className="text-label-sm text-on-surface m-0">
              {T.levelOf(file)}{themeTag}
            </h3>
            <code className="text-mono-xs text-on-surface-muted">{file}</code>
          </div>
          <div className="flex flex-col gap-xs">
            {groupBlocks}
          </div>
        </section>
      )
    }
  }

  return (
    <aside className="flex flex-col w-96 shrink-0 bg-layer-1 border-r border-border-default min-h-0 overflow-hidden">
      {/* Category Tabs */}
      <nav
        role="tablist"
        aria-label="Token Categories"
        className="flex flex-wrap gap-3xs p-xs bg-layer-2 border-b border-border-default shrink-0"
      >
        {categories.map((cat) => {
          const count = [...tokens.values()].filter((t) => T.categoryOf(t.file) === cat).length
          const isActive = cat === activeCategory
          const hasDirty = dirtyCategories.has(cat)
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat)}
              className={[
                'relative inline-flex items-center gap-2xs px-xs py-2xs rounded-2xs text-label-xs cursor-pointer transition-colors border-sm',
                isActive
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-layer-1 text-on-surface-secondary border-border-subtle hover:bg-layer-1-hover hover:text-on-surface'
              ].join(' ')}
            >
              <span>{CATEGORY_LABELS[cat] ?? cat}</span>
              <span className={`text-mono-xs ${isActive ? 'text-on-primary opacity-80' : 'text-on-surface-muted'}`}>
                {count}
              </span>
              {hasDirty && (
                <span className="w-1.5 h-1.5 rounded-full bg-warning" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Search & Level Filter */}
      <div className="flex items-center gap-2xs p-xs border-b border-border-default bg-layer-1 shrink-0">
        <input
          type="search"
          placeholder="搜尋 token，例如 blue.500、radius"
          autoComplete="off"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="h-control-sm px-xs rounded-xs flex-1 min-w-0 bg-layer-2 text-on-surface text-body-xs border-sm border-border-default outline-none focus:border-border-focus"
        />
        <select
          aria-label="Token 層級"
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
          className="h-control-sm px-xs rounded-xs bg-layer-2 text-on-surface text-body-xs border-sm border-border-default outline-none cursor-pointer focus:border-border-focus"
        >
          <option value="all">全部層級</option>
          <option value="global">Global</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Editor Body */}
      <div id="playground-editor-body" className="flex-1 min-h-0 overflow-y-auto p-xs flex flex-col gap-md">
        {fileSections.length > 0 ? (
          fileSections
        ) : (
          <div className="p-lg text-center text-body-sm text-on-surface-muted">
            {query ? `找不到符合「${query}」的 token` : '這個分類沒有 token'}
          </div>
        )}
      </div>
    </aside>
  )
}
