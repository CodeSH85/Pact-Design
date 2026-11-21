import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseCssVariables } from '@pact-design/tokens/utils/contrast.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const require = createRequire(import.meta.url)

const TOKENS_CSS_PATH = require.resolve('@pact-design/tokens/css')
const INDEX_CSS_PATH = path.join(ROOT_DIR, 'build/css/index.css')
const THEME_CSS_PATH = path.join(ROOT_DIR, 'build/css/theme.css')
const UNO_PRESET_PATH = path.join(ROOT_DIR, 'build/uno/preset.js')
const UNO_TYPES_PATH = path.join(ROOT_DIR, 'build/uno/preset.d.ts')

const EXPECTED_THEME_SLOTS = [
  'colors',
  'spacing',
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'borderRadius',
  'borderWidth',
  'lineWidth',
  'ringWidth',
  'boxShadow',
  'zIndex',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'duration',
  'easing'
]

function extractCssVarRefs(value) {
  const refs = []
  const re = /var\((--pd-[a-z0-9-]+)\)/g
  let m
  while ((m = re.exec(value)) !== null) {
    refs.push(m[1])
  }
  return refs
}

describe('@pact-design/styles Build Contract (CSS Layers + UnoCSS Preset)', () => {
  const tokensCss = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8')
  const { lightRaw } = parseCssVariables(tokensCss)

  it('emits build/css/theme.css with light and dark color-scheme declarations', () => {
    const themeCss = fs.readFileSync(THEME_CSS_PATH, 'utf-8')
    assert.match(themeCss, /:root,\s*\[data-theme="light"\]\s*\{[\s\S]*?color-scheme:\s*light;[\s\S]*?\}/)
    assert.match(themeCss, /\[data-theme="dark"\]\s*\{[\s\S]*?color-scheme:\s*dark;[\s\S]*?\}/)
  })

  it('emits self-contained layered build/css/index.css with tokens and theme layers', () => {
    const indexCss = fs.readFileSync(INDEX_CSS_PATH, 'utf-8')
    assert.match(indexCss, /@layer pact\.tokens,\s*pact\.theme;/)
    assert.match(indexCss, /@layer pact\.tokens\s*\{[\s\S]*?--pd-system-background-base:/)
    assert.match(indexCss, /@layer pact\.theme\s*\{[\s\S]*?color-scheme:\s*light;[\s\S]*?color-scheme:\s*dark;/)
  })

  it('exports pactTheme, pactThemeCss, pactPreset (opt-in preflights), and default preset', async() => {
    const mod = await import(`${pathToFileURL(UNO_PRESET_PATH).href}?t=${Date.now()}`)
    assert.ok(mod.pactTheme && typeof mod.pactTheme === 'object', 'Expected pactTheme export')
    assert.equal(typeof mod.pactThemeCss, 'string', 'Expected pactThemeCss export')
    assert.equal(typeof mod.pactPreset, 'function', 'Expected pactPreset function export')
    assert.equal(mod.default, mod.pactPreset, 'Expected default export to equal pactPreset')

    const defaultPreset = mod.pactPreset()
    assert.equal(defaultPreset.name, 'pact-design')
    assert.deepEqual(defaultPreset.theme, mod.pactTheme)
    assert.equal(defaultPreset.preflights, undefined, 'Expected preflights to be opt-in by default')

    const withPreflights = mod.pactPreset({ preflights: true })
    assert.ok(Array.isArray(withPreflights.preflights) && withPreflights.preflights.length === 1)
    const preflightCss = withPreflights.preflights[0].getCSS()
    assert.match(preflightCss, /color-scheme:\s*light;/)
    assert.match(preflightCss, /color-scheme:\s*dark;/)

    for (const slot of EXPECTED_THEME_SLOTS) {
      assert.ok(slot in mod.pactTheme, `Expected pactTheme.${slot} to exist`)
    }

    // Component shadow and z-index rules preserve full keys while adding stripped aliases
    assert.equal(
      mod.pactTheme.boxShadow['tab-trigger-shadow-segmented-selected'],
      'var(--pd-component-tab-trigger-shadow-segmented-selected)'
    )
    assert.equal(
      mod.pactTheme.boxShadow['tab-trigger-segmented-selected'],
      'var(--pd-component-tab-trigger-shadow-segmented-selected)'
    )
    assert.equal(
      mod.pactTheme.boxShadow['modal-content'],
      'var(--pd-component-modal-content-shadow)'
    )
    assert.equal(
      mod.pactTheme.zIndex['modal-overlay-z-index'],
      'var(--pd-component-modal-overlay-z-index)'
    )
    assert.equal(
      mod.pactTheme.zIndex['modal-overlay'],
      'var(--pd-component-modal-overlay-z-index)'
    )
    assert.equal(
      mod.pactTheme.zIndex['popover-surface'],
      'var(--pd-component-popover-surface-z-index)'
    )
    assert.equal(
      mod.pactTheme.zIndex['toast-container'],
      'var(--pd-component-toast-container-z-index)'
    )
  })

  it('ensures every var(--pd-*) referenced in pactTheme exists in @pact-design/tokens/css', async() => {
    const mod = await import(`${pathToFileURL(UNO_PRESET_PATH).href}?t=${Date.now() + 1}`)
    const missing = []

    for (const [slot, entries] of Object.entries(mod.pactTheme)) {
      for (const [key, val] of Object.entries(entries)) {
        const strings = typeof val === 'string'
          ? [val]
          : Array.isArray(val)
            ? [val[0], ...Object.values(val[1] ?? {})]
            : []

        for (const str of strings) {
          const refs = extractCssVarRefs(str)
          assert.ok(refs.length > 0, `Expected CSS var reference for pactTheme.${slot}.${key}, got: ${str}`)
          for (const ref of refs) {
            if (!lightRaw.has(ref)) {
              missing.push(`pactTheme.${slot}.${key} -> ${ref}`)
            }
          }
        }
      }
    }

    assert.deepEqual(missing, [], `Dangling CSS variable references in pactTheme:\n${missing.join('\n')}`)
  })

  it('generates TypeScript declarations in build/uno/preset.d.ts', () => {
    const dts = fs.readFileSync(UNO_TYPES_PATH, 'utf-8')
    assert.ok(dts.includes('export interface PactTheme'), 'Expected PactTheme interface in preset.d.ts')
    assert.ok(dts.includes('export interface PactPresetOptions'), 'Expected PactPresetOptions interface in preset.d.ts')
    assert.ok(dts.includes('export declare const pactTheme: PactTheme'), 'Expected pactTheme declaration in preset.d.ts')
    assert.ok(dts.includes('export declare const pactThemeCss: string'), 'Expected pactThemeCss declaration in preset.d.ts')
    assert.ok(dts.includes('export declare function pactPreset(options?: PactPresetOptions): PactPreset'), 'Expected pactPreset declaration in preset.d.ts')
  })
})
