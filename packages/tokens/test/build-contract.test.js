import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { isDtcgToken, isThemedToken, tokens } from '../src/index.ts'
import { parseCssVariables } from '../utils/contrast.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const CSS_VARS_PATH = path.join(ROOT_DIR, 'build/css/_variables.css')
const META_PATH = path.join(ROOT_DIR, 'build/meta/tokens.json')

describe('Build Contract (CSS Variables + Token Metadata)', () => {
  const cssContent = fs.readFileSync(CSS_VARS_PATH, 'utf-8')
  const { lightRaw, darkOverrides } = parseCssVariables(cssContent)

  it('ensures dark mode overrides only redefine variables that exist in the light theme', () => {
    const orphans = [...darkOverrides.keys()].filter((k) => !lightRaw.has(k))
    assert.deepEqual(orphans, [], `Dark theme defines variables missing from light theme:\n${orphans.join('\n')}`)
  })

  it('emits build/meta/tokens.json matching every generated CSS custom property', () => {
    const entries = JSON.parse(fs.readFileSync(META_PATH, 'utf-8'))
    assert.ok(Array.isArray(entries) && entries.length > 0, 'Expected non-empty token metadata array')

    const missing = []
    for (const entry of entries) {
      assert.equal(typeof entry.name, 'string')
      assert.ok(Array.isArray(entry.path) && entry.path.length > 0)
      assert.ok(!entry.path.includes('$root'), `Metadata path leaked $root segment: ${entry.path.join('.')}`)
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
    inspect(tokens, '')
    assert.deepEqual(withExtensions, [], `Unexpected $extensions in source tokens:\n${withExtensions.join('\n')}`)
  })
})
