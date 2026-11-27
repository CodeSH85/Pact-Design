import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { globalColor } from '../src/global/color.ts'
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
  '--pd-system-color-surface-base',
  '--pd-system-color-surface-layer-1',
  '--pd-system-color-surface-layer-1-hover',
  '--pd-system-color-surface-layer-1-active',
  '--pd-system-color-surface-layer-1-selected',
  '--pd-system-color-surface-layer-1-selected-hover',
  '--pd-system-color-surface-layer-2',
  '--pd-system-color-surface-layer-2-hover',
  '--pd-system-color-surface-layer-2-active',
  '--pd-system-color-surface-layer-2-selected',
  '--pd-system-color-surface-layer-2-selected-hover',
  '--pd-system-color-surface-elevated',
  '--pd-system-color-surface-hover',
  '--pd-system-color-surface-active',
  '--pd-system-color-surface-selected',
  '--pd-system-color-surface-selected-hover'
]

describe('CSS Variables Build Output (build/css/_variables.css)', () => {
  const cssContent = fs.readFileSync(CSS_VARS_PATH, 'utf-8')
  const { lightRaw, darkOverrides, systemDarkOverrides, darkRaw } = parseCssVariables(cssContent)

  it('generates non-empty Light, Dark, and System-Dark theme blocks without unserialized values', () => {
    assert.ok(lightRaw.size > 0, 'Expected Light theme variables in :root, [data-theme="light"]')
    assert.ok(darkOverrides.size > 0, 'Expected Dark theme override variables in [data-theme="dark"]')
    assert.deepEqual(
      [...systemDarkOverrides.entries()],
      [...darkOverrides.entries()],
      'Expected @media (prefers-color-scheme: dark) [data-theme="system"] overrides to match [data-theme="dark"]'
    )

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

describe('Global Color Scale Midpoint (600) Contrast Audit', () => {
  const cssContent = fs.readFileSync(CSS_VARS_PATH, 'utf-8')
  const { lightRaw } = parseCssVariables(cssContent)

  const palettes = Object.entries(globalColor).filter(
    ([, group]) => group && typeof group === 'object' && '600' in group
  )

  for (const [paletteName] of palettes) {
    const cssVarName = `--pd-global-color-${kebab(paletteName)}-600`
    it(`${cssVarName} passes APCA |Lc| >= 60 and WCAG >= 4.5:1 against #ffffff`, () => {
      const cssColor = resolveCssVariable(cssVarName, lightRaw)
      const res = evaluateWCAG(cssColor, '#ffffff', 4.5, 60)
      assert.ok(
        res.passesTarget && res.passesWcag,
        `${cssVarName} (${cssColor}) failed on #ffffff: APCA Lc=${res.lc} (min |60|), WCAG=${res.ratio}:1 (min 4.5:1)`
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
          { textVar: '--pd-system-color-on-surface', minLc: 75, minRatio: 7.0 },
          { textVar: '--pd-system-color-on-surface-secondary', minLc: 60, minRatio: 4.5 },
          { textVar: '--pd-system-color-on-surface-muted', minLc: 45, minRatio: 3.0 }
        ]

        for (const bgVar of SURFACE_VARS) {
          const bgColor = resolveCssVariable(bgVar, varMap)
          for (const { textVar, minLc, minRatio } of textRules) {
            const txtColor = resolveCssVariable(textVar, varMap)
            const res = evaluateWCAG(txtColor, bgColor, minRatio, minLc)
            assert.ok(
              res.passesTarget && res.passesWcag,
              `[${themeName}] ${textVar} (${txtColor}) on ${bgVar} (${bgColor}) failed: APCA |Lc|=${res.absLc} (min ${minLc}), WCAG=${res.ratio}:1 (min ${minRatio}:1)`
            )
          }
        }
      })

      it('maintains high contrast on solid semantic tonal variants (default, strong, stronger)', () => {
        for (const role of SEMANTIC_ROLES) {
          const onVar = `--pd-system-color-on-${role}`
          const onColor = resolveCssVariable(onVar, varMap)
          const bgVars = [
            `--pd-system-color-${role}`,
            `--pd-system-color-${role}-strong`,
            `--pd-system-color-${role}-stronger`
          ]

          for (const bgVar of bgVars) {
            const bgColor = resolveCssVariable(bgVar, varMap)
            const res = evaluateWCAG(onColor, bgColor, 4.5, 60)
            assert.ok(
              res.passesTarget && res.passesWcag,
              `[${themeName}] ${onVar} (${onColor}) on ${bgVar} (${bgColor}) failed: APCA |Lc|=${res.absLc} (min 60), WCAG=${res.ratio}:1 (min 4.5:1)`
            )
          }
        }
      })

      it('maintains non-text contrast for vivid semantic accents on layer-1 and high contrast with on-<role> foregrounds', () => {
        const layer1Color = resolveCssVariable('--pd-system-color-surface-layer-1', varMap)

        for (const role of SEMANTIC_ROLES) {
          const vividVar = `--pd-system-color-${role}-vivid`
          const vividColor = resolveCssVariable(vividVar, varMap)
          const onVar = `--pd-system-color-on-${role}`
          const onColor = resolveCssVariable(onVar, varMap)

          const onLayer1 = evaluateWCAG(vividColor, layer1Color, 3.0, 20)
          assert.ok(
            onLayer1.passesTarget && onLayer1.passesWcag,
            `[${themeName}] ${vividVar} (${vividColor}) on --pd-system-color-surface-layer-1 (${layer1Color}) failed: APCA |Lc|=${onLayer1.absLc} (min 20), WCAG=${onLayer1.ratio}:1 (min 3.0:1)`
          )

          const fgOnVivid = evaluateWCAG(onColor, vividColor, 4.5, 60)
          assert.ok(
            fgOnVivid.passesTarget && fgOnVivid.passesWcag,
            `[${themeName}] ${onVar} (${onColor}) on ${vividVar} (${vividColor}) failed: APCA |Lc|=${fgOnVivid.absLc} (min 60), WCAG=${fgOnVivid.ratio}:1 (min 4.5:1)`
          )
        }
      })

      it('maintains high contrast on tinted semantic containers (on-<role>-subtle on subtle/muted/soft & layer-2)', () => {
        const layer2Color = resolveCssVariable('--pd-system-color-surface-layer-2', varMap)

        for (const role of SEMANTIC_ROLES) {
          const onSubtleVar = `--pd-system-color-on-${role}-subtle`
          const onSubtleColor = resolveCssVariable(onSubtleVar, varMap)
          const subtleBgVars = [
            `--pd-system-color-${role}-subtle`,
            `--pd-system-color-${role}-muted`,
            `--pd-system-color-${role}-soft`
          ]

          for (const subtleBgVar of subtleBgVars) {
            const subtleBgColor = resolveCssVariable(subtleBgVar, varMap)
            const onSubtleRes = evaluateWCAG(onSubtleColor, subtleBgColor, 4.5, 60)
            assert.ok(
              onSubtleRes.passesTarget && onSubtleRes.passesWcag,
              `[${themeName}] ${onSubtleVar} (${onSubtleColor}) on ${subtleBgVar} (${subtleBgColor}) failed: APCA |Lc|=${onSubtleRes.absLc} (min 60), WCAG=${onSubtleRes.ratio}:1 (min 4.5:1)`
            )
          }

          const onLayer2Res = evaluateWCAG(onSubtleColor, layer2Color, 4.5, 60)
          assert.ok(
            onLayer2Res.passesTarget && onLayer2Res.passesWcag,
            `[${themeName}] ${onSubtleVar} (${onSubtleColor}) on --pd-system-color-surface-layer-2 (${layer2Color}) failed: APCA |Lc|=${onLayer2Res.absLc} (min 60), WCAG=${onLayer2Res.ratio}:1 (min 4.5:1)`
          )
        }
      })

      it('maintains readable contrast for semantic foreground text & icons on neutral surfaces', () => {
        const layer1Color = resolveCssVariable('--pd-system-color-surface-layer-1', varMap)
        const layer2HoverColor = resolveCssVariable('--pd-system-color-surface-layer-2-hover', varMap)

        for (const role of SEMANTIC_ROLES) {
          const textVars = [
            `--pd-system-color-${role}-text`,
            `--pd-system-color-${role}-text-strong`,
            `--pd-system-color-${role}-text-stronger`
          ]

          for (const textVar of textVars) {
            const textColor = resolveCssVariable(textVar, varMap)

            const onLayer1 = evaluateWCAG(textColor, layer1Color, 4.5, 60)
            assert.ok(
              onLayer1.passesTarget && onLayer1.passesWcag,
              `[${themeName}] ${textVar} (${textColor}) on --pd-system-color-surface-layer-1 (${layer1Color}) failed: APCA |Lc|=${onLayer1.absLc} (min 60), WCAG=${onLayer1.ratio}:1 (min 4.5:1)`
            )

            const onLayer2Hover = evaluateWCAG(textColor, layer2HoverColor, 4.5, 45)
            assert.ok(
              onLayer2Hover.passesTarget && onLayer2Hover.passesWcag,
              `[${themeName}] ${textVar} (${textColor}) on --pd-system-color-surface-layer-2-hover (${layer2HoverColor}) failed: APCA |Lc|=${onLayer2Hover.absLc} (min 45), WCAG=${onLayer2Hover.ratio}:1 (min 4.5:1)`
            )
          }
        }
      })

      it('maintains non-text contrast for strong borders, semantic strong borders, and focus rings on layer-2', () => {
        const layer2Color = resolveCssVariable('--pd-system-color-surface-layer-2', varMap)
        const neutralStrong = resolveCssVariable('--pd-system-color-border-strong', varMap)
        const neutralRes = evaluateWCAG(neutralStrong, layer2Color, 3.0, 45)
        assert.ok(
          neutralRes.passesTarget && neutralRes.passesWcag,
          `[${themeName}] --pd-system-color-border-strong (${neutralStrong}) on --pd-system-color-surface-layer-2 (${layer2Color}) failed: APCA |Lc|=${neutralRes.absLc} (min 45), WCAG=${neutralRes.ratio}:1 (min 3.0:1)`
        )

        const semanticBorderVars = [
          '--pd-system-color-border-focus',
          '--pd-system-color-border-focus-danger',
          ...SEMANTIC_ROLES.map((role) => `--pd-system-color-${role}-border-strong`)
        ]

        for (const borderVar of semanticBorderVars) {
          const borderColor = resolveCssVariable(borderVar, varMap)
          const res = evaluateWCAG(borderColor, layer2Color, 3.0, 45)
          assert.ok(
            res.passesTarget && res.passesWcag,
            `[${themeName}] ${borderVar} (${borderColor}) on --pd-system-color-surface-layer-2 (${layer2Color}) failed: APCA |Lc|=${res.absLc} (min 45), WCAG=${res.ratio}:1 (min 3.0:1)`
          )
        }
      })
    })
  }
})
