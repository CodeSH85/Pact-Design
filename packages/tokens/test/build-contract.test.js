import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { isDtcgToken, isThemedToken, tokenModules } from '../src/index.ts'
import { parseCssVariables } from '../utils/contrast.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const CSS_VARS_PATH = path.join(ROOT_DIR, 'build/css/_variables.css')
const META_PATH = path.join(ROOT_DIR, 'build/meta/tokens.json')
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

describe('Build Contract (CSS Variables + UnoCSS Preset)', () => {
  const cssContent = fs.readFileSync(CSS_VARS_PATH, 'utf-8')
  const { lightRaw, darkOverrides } = parseCssVariables(cssContent)

  it('exports pactTheme, pactPreset, and default preset from build/uno/preset.js', async() => {
    const mod = await import(`${pathToFileURL(UNO_PRESET_PATH).href}?t=${Date.now()}`)
    assert.ok(mod.pactTheme && typeof mod.pactTheme === 'object', 'Expected pactTheme export')
    assert.equal(typeof mod.pactPreset, 'function', 'Expected pactPreset function export')
    assert.equal(mod.default, mod.pactPreset, 'Expected default export to equal pactPreset')

    const preset = mod.pactPreset()
    assert.equal(preset.name, 'pact-design')
    assert.deepEqual(preset.theme, mod.pactTheme)

    for (const slot of EXPECTED_THEME_SLOTS) {
      assert.ok(slot in mod.pactTheme, `Expected pactTheme.${slot} to exist`)
    }
  })

  it('ensures every var(--pd-*) referenced in pactTheme exists in _variables.css', async() => {
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

  it('ensures dark mode overrides only redefine variables that exist in the light theme', () => {
    const orphans = [...darkOverrides.keys()].filter((k) => !lightRaw.has(k))
    assert.deepEqual(orphans, [], `Dark theme defines variables missing from light theme:\n${orphans.join('\n')}`)
  })

  it('generates TypeScript declarations in build/uno/preset.d.ts', () => {
    const dts = fs.readFileSync(UNO_TYPES_PATH, 'utf-8')
    assert.ok(dts.includes('export interface PactTheme'), 'Expected PactTheme interface in preset.d.ts')
    assert.ok(dts.includes('export declare const pactTheme: PactTheme'), 'Expected pactTheme declaration in preset.d.ts')
    assert.ok(dts.includes('export declare function pactPreset(): PactPreset'), 'Expected pactPreset declaration in preset.d.ts')
  })

  it('emits build/meta/tokens.json matching every generated CSS custom property', () => {
    const entries = JSON.parse(fs.readFileSync(META_PATH, 'utf-8'))
    assert.ok(Array.isArray(entries) && entries.length > 0, 'Expected non-empty token metadata array')

    const missing = []
    for (const entry of entries) {
      assert.equal(typeof entry.name, 'string')
      assert.ok(Array.isArray(entry.path) && entry.path.length > 0)
      if (!lightRaw.has(`--${entry.name}`)) {
        missing.push(`${entry.path.join('.')} -> --${entry.name}`)
      }
    }

    assert.deepEqual(missing, [], `Metadata entries missing from _variables.css:\n${missing.join('\n')}`)
  })

  it('keeps source token definitions pure without target-specific $extensions', () => {
    const withExtensions = []
    function inspect(node, trail) {
      if (isThemedToken(node)) {
        inspect(node.light, `${trail}[light]`)
        inspect(node.dark, `${trail}[dark]`)
        return
      }
      if (isDtcgToken(node)) {
        if ('$extensions' in node) withExtensions.push(trail)
        return
      }
      if (node && typeof node === 'object') {
        for (const [k, v] of Object.entries(node)) {
          inspect(v, trail ? `${trail}.${k}` : k)
        }
      }
    }
    for (const [mod, tree] of Object.entries(tokenModules)) {
      inspect(tree, mod)
    }
    assert.deepEqual(withExtensions, [], `Unexpected $extensions in source tokens:\n${withExtensions.join('\n')}`)
  })
})
