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
const LAYERED_CSS_PATH = path.join(ROOT_DIR, 'build/css/layered.css')
const TOKENS_OUT_CSS_PATH = path.join(ROOT_DIR, 'build/css/tokens.css')
const THEME_CSS_PATH = path.join(ROOT_DIR, 'build/css/theme.css')
const RESET_CSS_PATH = path.join(ROOT_DIR, 'build/css/reset.css')
const COMPONENTS_CSS_PATH = path.join(ROOT_DIR, 'build/css/components.css')
const COMPONENTS_DIR_PATH = path.join(ROOT_DIR, 'build/css/components')
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
  'easing',
  'opacity'
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

describe('@pact-design/styles Build Contract (CSS Layers + Component CSS + UnoCSS Preset)', () => {
  const tokensCss = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8')
  const { lightRaw } = parseCssVariables(tokensCss)

  it('emits build/css/theme.css with light and dark color-scheme declarations and shared overlay keyframes', () => {
    const themeCss = fs.readFileSync(THEME_CSS_PATH, 'utf-8')
    assert.match(themeCss, /:root,\s*\[data-theme="light"\]\s*\{[\s\S]*?color-scheme:\s*light;[\s\S]*?\}/)
    assert.match(themeCss, /\[data-theme="dark"\]\s*\{[\s\S]*?color-scheme:\s*dark;[\s\S]*?\}/)
    for (const kf of ['pd-fade-in', 'pd-fade-out', 'pd-zoom-in', 'pd-zoom-out']) {
      assert.match(themeCss, new RegExp(`@keyframes\\s+${kf}\\b`), `Expected shared @keyframes ${kf} in theme.css`)
    }
  })

  it('emits granular tokens.css, reset.css, components.css, and per-component stylesheets', () => {
    const tokensOutCss = fs.readFileSync(TOKENS_OUT_CSS_PATH, 'utf-8')
    assert.match(tokensOutCss, /--pd-system-color-surface-base:/)

    const resetCss = fs.readFileSync(RESET_CSS_PATH, 'utf-8')
    assert.match(resetCss, /:where\(\.pd-reset\)\s*\{/)
    assert.match(resetCss, /:where\(\.pd-reset\):where\(/)
    assert.doesNotMatch(resetCss, /&/, 'Expected Lightning CSS to flatten nested selectors in reset.css')

    const componentsCss = fs.readFileSync(COMPONENTS_CSS_PATH, 'utf-8')
    assert.match(componentsCss, /\.pd-button\s*\{/)
    assert.match(componentsCss, /\.pd-button:where\(\[data-variant="?primary"?\]/)
    assert.match(componentsCss, /\.pd-button:where\(\[data-radius="?full"?\]\)/)
    assert.match(componentsCss, /\.pd-toggle-button\s*\{/)
    assert.match(componentsCss, /\.pd-toggle-button-group\s*\{/)
    assert.doesNotMatch(componentsCss, /&/, 'Expected Lightning CSS to flatten nested selectors in components.css')

    for (const fileName of [
      'button.css',
      'toggle-button.css',
      'badge.css',
      'selection-control.css',
      'checkbox.css',
      'radio.css',
      'switch.css',
      'slider.css',
      'separator.css',
      'field.css',
      'form.css',
      'tab.css',
      'breadcrumbs.css',
      'disclosure.css',
      'collection.css',
      'tree.css',
      'popover.css',
      'tooltip.css',
      'menu.css',
      'select.css',
      'dialog.css',
      'modal.css',
      'sheet.css',
      'toast.css',
      'calendar.css'
    ]) {
      const singlePath = path.join(COMPONENTS_DIR_PATH, fileName)
      assert.ok(fs.existsSync(singlePath), `Expected granular component stylesheet ${fileName}`)
      const singleCss = fs.readFileSync(singlePath, 'utf-8')
      assert.doesNotMatch(singleCss, /&/, `Expected flattened selectors in components/${fileName}`)
    }
  })

  it('emits self-contained build/css/index.css (unlayered components) and opt-in build/css/layered.css', () => {
    const indexCss = fs.readFileSync(INDEX_CSS_PATH, 'utf-8')
    assert.match(indexCss, /@layer pact\.tokens,\s*pact\.theme;/)
    assert.match(indexCss, /@layer pact\.tokens\s*\{[\s\S]*?--pd-system-color-surface-base:/)
    assert.match(indexCss, /@layer pact\.theme\s*\{[\s\S]*?color-scheme:\s*light;[\s\S]*?color-scheme:\s*dark;/)
    assert.doesNotMatch(indexCss, /@layer pact\.components/, 'Default index.css keeps components unlayered so unlayered resets (Tailwind v3 / UnoCSS reset / Normalize) do not wipe component styles')
    assert.match(indexCss, /:where\(\.pd-reset\)\s*\{/)
    assert.match(indexCss, /\.pd-button\s*\{[\s\S]*?\.pd-toggle-button\s*\{/)

    const layeredCss = fs.readFileSync(LAYERED_CSS_PATH, 'utf-8')
    assert.match(layeredCss, /@layer pact\.tokens,\s*pact\.theme,\s*pact\.reset,\s*pact\.components;/)
    assert.match(layeredCss, /@layer pact\.reset\s*\{[\s\S]*?:where\(\.pd-reset\)\s*\{/)
    assert.match(layeredCss, /@layer pact\.components\s*\{[\s\S]*?\.pd-button\s*\{[\s\S]*?\.pd-toggle-button\s*\{/)
  })

  it('ensures every var(--pd-*) referenced in compiled reset and component CSS exists in @pact-design/tokens/css', () => {
    const filesToCheck = [
      ['reset.css', RESET_CSS_PATH],
      ['components.css', COMPONENTS_CSS_PATH]
    ]
    const missing = []

    for (const [label, filePath] of filesToCheck) {
      const css = fs.readFileSync(filePath, 'utf-8')
      for (const ref of extractCssVarRefs(css)) {
        if (!lightRaw.has(ref)) {
          missing.push(`${label} -> ${ref}`)
        }
      }
    }

    assert.deepEqual(
      missing,
      [],
      `Dangling CSS variable references in compiled component/reset CSS:\n${missing.join('\n')}`
    )
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
      mod.pactTheme.boxShadow['tab-trigger-segmented-shadow-selected'],
      'var(--pd-component-tab-trigger-segmented-shadow-selected)'
    )
    assert.equal(
      mod.pactTheme.boxShadow['tab-trigger-segmented-selected'],
      'var(--pd-component-tab-trigger-segmented-shadow-selected)'
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

    // System semantic font families and weights map to UnoCSS typography utilities
    assert.equal(mod.pactTheme.fontFamily.sans, 'var(--pd-system-font-family-sans)')
    assert.equal(mod.pactTheme.fontFamily.mono, 'var(--pd-system-font-family-mono)')
    assert.equal(mod.pactTheme.fontWeight.normal, 'var(--pd-system-font-weight-normal)')
    assert.equal(mod.pactTheme.fontWeight.medium, 'var(--pd-system-font-weight-medium)')
    assert.equal(mod.pactTheme.fontWeight.bold, 'var(--pd-system-font-weight-bold)')

    // Focus shadow halos and system opacity utilities
    assert.equal(mod.pactTheme.boxShadow.focus, 'var(--pd-system-elevation-focus)')
    assert.equal(mod.pactTheme.boxShadow['focus-danger'], 'var(--pd-system-elevation-focus-danger)')
    assert.equal(mod.pactTheme.opacity.halo, 'var(--pd-system-opacity-halo)')
    assert.equal(mod.pactTheme.opacity.disabled, 'var(--pd-system-opacity-disabled)')
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
