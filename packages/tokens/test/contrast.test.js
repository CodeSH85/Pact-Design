import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { kebab } from '../utils/helper.js'
import {
  evaluateWCAG,
  parseCssVariables,
  resolveCssVariable
} from '../utils/contrast.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const CSS_VARS_PATH = path.join(ROOT_DIR, 'build/css/_variables.css')
const GLOBAL_COLOR_PATH = path.join(ROOT_DIR, 'tokens/color/global.json')

const SEMANTIC_ROLES = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'neutral'
]

const SURFACE_VARS = [
  '--system-background-base',
  '--system-background-layer-1',
  '--system-background-layer-1-hover',
  '--system-background-layer-1-active',
  '--system-background-layer-1-selected',
  '--system-background-layer-1-selected-hover',
  '--system-background-layer-2',
  '--system-background-layer-2-hover',
  '--system-background-layer-2-active',
  '--system-background-layer-2-selected',
  '--system-background-layer-2-selected-hover',
  '--system-background-elevated',
  '--system-background-hover',
  '--system-background-active',
  '--system-background-selected',
  '--system-background-selected-hover'
]

describe('CSS Variables Build Output (build/css/_variables.css)', () => {
  const cssContent = fs.readFileSync(CSS_VARS_PATH, 'utf-8')
  const { lightRaw, darkOverrides, darkRaw } = parseCssVariables(cssContent)

  it('generates non-empty Light and Dark theme blocks without unserialized values', () => {
    assert.ok(lightRaw.size > 0, 'Expected Light theme variables in :root, [data-theme="light"]')
    assert.ok(darkOverrides.size > 0, 'Expected Dark theme override variables in [data-theme="dark"]')

    for (const [name, val] of [...lightRaw.entries(), ...darkOverrides.entries()]) {
      assert.ok(!val.includes('[object Object]'), `${name} has unserialized [object Object]: ${val}`)
      assert.ok(!val.includes('undefined'), `${name} has undefined in value: ${val}`)
      assert.ok(!val.includes('NaN'), `${name} has NaN in value: ${val}`)
    }
  })

  it('resolves every var(--*) reference cleanly in both Light and Dark themes', () => {
    for (const name of lightRaw.keys()) {
      const resolvedLight = resolveCssVariable(name, lightRaw)
      assert.ok(!resolvedLight.includes('var('), `Unresolved var() in Light ${name}: ${resolvedLight}`)

      const resolvedDark = resolveCssVariable(name, darkRaw)
      assert.ok(!resolvedDark.includes('var('), `Unresolved var() in Dark ${name}: ${resolvedDark}`)
    }
  })
})

describe('Global Color Scale Midpoint (500) Contrast Audit', () => {
  const cssContent = fs.readFileSync(CSS_VARS_PATH, 'utf-8')
  const { lightRaw } = parseCssVariables(cssContent)
  const globalTokens = JSON.parse(fs.readFileSync(GLOBAL_COLOR_PATH, 'utf-8')).global

  const palettes = Object.entries(globalTokens).filter(
    ([, group]) => group && typeof group === 'object' && '500' in group
  )

  for (const [paletteName] of palettes) {
    const cssVarName = `--global-${kebab(paletteName)}-500`
    it(`${cssVarName} passes APCA |Lc| >= 60 against #ffffff`, () => {
      const cssColor = resolveCssVariable(cssVarName, lightRaw)
      const res = evaluateWCAG(cssColor, '#ffffff', 4.5, 60)
      assert.ok(
        res.passesTarget,
        `${cssVarName} (${cssColor}) failed on #ffffff: APCA Lc=${res.lc} (min |60|), WCAG=${res.ratio}:1`
      )
    })
  }
})

describe('System Semantic Color Contrast Audit (Light & Dark CSS Variables)', () => {
  const cssContent = fs.readFileSync(CSS_VARS_PATH, 'utf-8')
  const { lightRaw, darkRaw } = parseCssVariables(cssContent)

  const themes = [
    ['light', lightRaw],
    ['dark', darkRaw]
  ]

  for (const [themeName, varMap] of themes) {
    describe(`Theme: [data-theme="${themeName}"]`, () => {
      it('maintains readable text hierarchy across all surface and interactive backgrounds', () => {
        const textRules = [
          { textVar: '--system-on-surface-default', minLc: 75, minRatio: 7.0 },
          { textVar: '--system-on-surface-secondary', minLc: 60, minRatio: 4.5 },
          { textVar: '--system-on-surface-muted', minLc: 45, minRatio: 3.0 }
        ]

        for (const bgVar of SURFACE_VARS) {
          const bgColor = resolveCssVariable(bgVar, varMap)
          for (const { textVar, minLc, minRatio } of textRules) {
            const txtColor = resolveCssVariable(textVar, varMap)
            const res = evaluateWCAG(txtColor, bgColor, minRatio, minLc)
            assert.ok(
              res.passesTarget,
              `[${themeName}] ${textVar} (${txtColor}) on ${bgVar} (${bgColor}) failed: APCA |Lc|=${res.absLc} (min ${minLc}), WCAG=${res.ratio}:1 (min ${minRatio}:1)`
            )
          }
        }
      })

      it('maintains high contrast on solid semantic action states (default, hover, active)', () => {
        for (const role of SEMANTIC_ROLES) {
          const onVar = `--system-semantic-on-${role}`
          const onColor = resolveCssVariable(onVar, varMap)
          const bgVars = [
            `--system-semantic-${role}`,
            `--system-semantic-${role}-hover`,
            `--system-semantic-${role}-active`
          ]

          for (const bgVar of bgVars) {
            const bgColor = resolveCssVariable(bgVar, varMap)
            const res = evaluateWCAG(onColor, bgColor, 4.5, 60)
            assert.ok(
              res.passesTarget,
              `[${themeName}] ${onVar} (${onColor}) on ${bgVar} (${bgColor}) failed: APCA |Lc|=${res.absLc} (min 60), WCAG=${res.ratio}:1 (min 4.5:1)`
            )
          }
        }
      })

      it('maintains high contrast on subtle status containers (on-<role>-subtle on <role>-subtle & layer-2)', () => {
        const layer2Color = resolveCssVariable('--system-background-layer-2', varMap)

        for (const role of SEMANTIC_ROLES) {
          const onSubtleVar = `--system-semantic-on-${role}-subtle`
          const subtleBgVar = `--system-semantic-${role}-subtle`
          const onSubtleColor = resolveCssVariable(onSubtleVar, varMap)
          const subtleBgColor = resolveCssVariable(subtleBgVar, varMap)

          const onSubtleRes = evaluateWCAG(onSubtleColor, subtleBgColor, 4.5, 60)
          assert.ok(
            onSubtleRes.passesTarget,
            `[${themeName}] ${onSubtleVar} (${onSubtleColor}) on ${subtleBgVar} (${subtleBgColor}) failed: APCA |Lc|=${onSubtleRes.absLc} (min 60), WCAG=${onSubtleRes.ratio}:1 (min 4.5:1)`
          )

          const onLayer2Res = evaluateWCAG(onSubtleColor, layer2Color, 4.5, 60)
          assert.ok(
            onLayer2Res.passesTarget,
            `[${themeName}] ${onSubtleVar} (${onSubtleColor}) on --system-background-layer-2 (${layer2Color}) failed: APCA |Lc|=${onLayer2Res.absLc} (min 60), WCAG=${onLayer2Res.ratio}:1 (min 4.5:1)`
          )
        }
      })

      it('maintains non-text contrast for strong borders and focus rings on layer-2', () => {
        const layer2Color = resolveCssVariable('--system-background-layer-2', varMap)
        for (const borderVar of ['--system-border-strong', '--system-border-focus']) {
          const borderColor = resolveCssVariable(borderVar, varMap)
          const res = evaluateWCAG(borderColor, layer2Color, 3.0, 45)
          assert.ok(
            res.passesTarget,
            `[${themeName}] ${borderVar} (${borderColor}) on --system-background-layer-2 (${layer2Color}) failed: APCA |Lc|=${res.absLc} (min 45), WCAG=${res.ratio}:1 (min 3.0:1)`
          )
        }
      })
    })
  }
})
