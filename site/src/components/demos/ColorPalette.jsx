import { useRef, useState } from 'react'
import { Button } from '../ui/Button.jsx'
import {
  calculateAPCA,
  colorValueToHex,
  colorValueToOklch,
  cssName,
  loadTokenCatalog,
  readableOn
} from '../../utils/tokens-loader.js'

const { files, lightTokens } = loadTokenCatalog()

const colorGlobalJson = files['tokens/color/global.json']?.global ?? {}
const scaleNames = [
  'gray',
  'coolGray',
  'warmGray',
  'cyan',
  'blue',
  'indigo',
  'purple',
  'magenta',
  'red',
  'orange',
  'yellow',
  'green',
  'mint'
]

const globalPalettes = scaleNames.map((scale) => {
  const stepsObj = colorGlobalJson[scale] ?? {}
  const steps = Object.keys(stepsObj)
    .filter((k) => !k.startsWith('$'))
    .sort((a, b) => Number(a) - Number(b))
    .map((step) => {
      const tokenId = `global.${scale}.${step}`
      const token = lightTokens.get(tokenId)
      const val = token?.node?.$value
      const hex = colorValueToHex(val)
      const [L, C, H] = colorValueToOklch(val)
      const cssVar = cssName(['global', scale, step])
      const lcWhite = Math.abs(calculateAPCA('#ffffff', val))
      const fg = readableOn(val)
      return {
        step,
        cssVar,
        hex,
        L: L.toFixed(3),
        C: C.toFixed(3),
        H: Math.round(H),
        lcWhite: lcWhite.toFixed(0),
        fg
      }
    })
  return { scale, steps }
})

export function ColorPalette() {
  const [toastText, setToastText] = useState(null)
  const timerRef = useRef(null)

  async function handleCopy(text) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback if clipboard API is unavailable
    }
    setToastText(`已複製 ${text}`)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setToastText(null)
    }, 1600)
  }

  return (
    <section className="flex flex-col gap-md pt-md border-t border-border-default">
      <div className="flex items-baseline justify-between gap-sm flex-wrap">
        <h2 className="m-0 text-heading-xs text-on-surface">
          Global 11 階 OKLCH 色票
        </h2>
        <span className="m-0 text-body-sm text-on-surface-muted">
          <Button variant="ghost">顯示文字</Button>
        </span>
      </div>

      <div className="flex flex-col gap-sm">
        {globalPalettes.map((palette) => (
          <div
            key={palette.scale}
            className="bg-layer-2 border border-border-default rounded-xs p-sm flex flex-col gap-xs"
          >
            <div className="flex items-center justify-between text-label-sm">
              <strong className="text-on-surface">{palette.scale}</strong>
              <code className="text-mono-xs text-on-surface-muted">
                --global-{palette.scale.replace(/([A-Z])/g, '-$1').toLowerCase()}-{'{50..1000}'}
              </code>
            </div>
            <div className="grid grid-cols-[repeat(11,minmax(64px,1fr))] gap-3xs overflow-x-auto">
              {palette.steps.map((s) => {
                const copyValue = `var(${s.cssVar})`
                return (
                  <button
                    key={s.step}
                    type="button"
                    className="flex flex-col justify-between h-68px p-2xs border border-black/8 rounded-2xs text-left cursor-pointer transition-transform duration-fast hover:-translate-y-1px"
                    style={{ background: copyValue, color: s.fg }}
                    onClick={() => handleCopy(copyValue)}
                    title={`Click to copy ${copyValue}\nOKLCH: ${s.L} ${s.C} ${s.H}\nHEX: ${s.hex}\nAPCA vs White: Lc ${s.lcWhite}`}
                  >
                    <span className="text-label-xs font-04 tabular-nums">{s.step}</span>
                    <span className="text-mono-xs text-11px opacity-92">{s.hex}</span>
                    <span className="text-mono-xs text-10px opacity-78 tabular-nums">L {s.L}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {toastText && (
        <div
          className="fixed bottom-md right-md z-toast py-xs px-sm bg-layer-2 text-on-surface border border-border-strong rounded-xs shadow-elevation-md text-mono-xs"
          role="status"
          aria-live="polite"
        >
          {toastText}
        </div>
      )}
    </section>
  )
}
