import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  resolveDisabled,
  resolveToggleProps
} from '../src/utils/index.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PACKAGE_ROOT = path.resolve(__dirname, '..')
const require = createRequire(import.meta.url)

const COMPONENTS = [
  'Button',
  'ToggleButton',
  'Badge',
  'Checkbox',
  'Switch',
  'Slider',
  'Menu',
  'Popover',
  'Modal',
  'Dialog',
  'Disclosure',
  'DisclosureGroup',
  'Breadcrumbs',
  'Tab',
  'TextField',
  'SearchField',
  'ListBox',
  'ComboBox',
  'Select',
  'Autocomplete',
  'DateField',
  'Calendar',
  'DatePicker',
  'FileTrigger',
  'Form',
  'Toast',
  'Tooltip',
  'Field',
  'Radio',
  'Separator',
  'Sheet',
  'Tree'
]

const PURE_DISPLAY_COMPONENTS = new Set(['Badge'])

describe('@pact-design/react package integrity', () => {
  const packageJsonPath = path.join(PACKAGE_ROOT, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

  it('declares correct package name, ESM type, and compiled dist exports', () => {
    assert.equal(packageJson.name, '@pact-design/react')
    assert.equal(packageJson.type, 'module')
    assert.equal(packageJson.main, './dist/index.js')
    assert.equal(packageJson.types, './dist/index.d.ts')
    assert.ok(packageJson.exports, 'package.json must declare exports')
    assert.deepEqual(packageJson.exports['.'], {
      types: './dist/index.d.ts',
      default: './dist/index.js'
    })
    assert.equal(packageJson.exports['./styles.css'], './dist/styles.css')
    assert.deepEqual(packageJson.exports['./components'], {
      types: './dist/components/index.d.ts',
      default: './dist/components/index.js'
    })
    assert.deepEqual(packageJson.exports['./utils'], {
      types: './dist/utils/index.d.ts',
      default: './dist/utils/index.js'
    })
  })

  it('emits compiled dist/ ESM, TypeScript declarations, use-client directives, and self-contained styles.css', () => {
    const distRoot = path.join(PACKAGE_ROOT, 'dist')
    assert.ok(fs.existsSync(path.join(distRoot, 'index.js')), 'dist/index.js must exist')
    assert.ok(fs.existsSync(path.join(distRoot, 'index.d.ts')), 'dist/index.d.ts must exist')
    assert.ok(fs.existsSync(path.join(distRoot, 'utils/index.js')), 'dist/utils/index.js must exist')
    assert.ok(fs.existsSync(path.join(distRoot, 'utils/index.d.ts')), 'dist/utils/index.d.ts must exist')

    const distStylesPath = path.join(distRoot, 'styles.css')
    assert.ok(fs.existsSync(distStylesPath), 'dist/styles.css must exist')
    const distStyles = fs.readFileSync(distStylesPath, 'utf-8')
    assert.match(distStyles, /--pd-system-color-surface-base:/)
    assert.match(distStyles, /:where\(\.pd-reset\)/)
    assert.match(distStyles, /\.pd-button\s*\{/)

    for (const name of COMPONENTS) {
      const compJsPath = path.join(distRoot, 'components', name, `${name}.js`)
      const compDtsPath = path.join(distRoot, 'components', name, `${name}.d.ts`)
      const barrelJsPath = path.join(distRoot, 'components', name, 'index.js')
      const barrelDtsPath = path.join(distRoot, 'components', name, 'index.d.ts')

      assert.ok(fs.existsSync(compJsPath), `dist/components/${name}/${name}.js must exist`)
      assert.ok(fs.existsSync(compDtsPath), `dist/components/${name}/${name}.d.ts must exist`)
      assert.ok(fs.existsSync(barrelJsPath), `dist/components/${name}/index.js must exist`)
      assert.ok(fs.existsSync(barrelDtsPath), `dist/components/${name}/index.d.ts must exist`)

      const compJs = fs.readFileSync(compJsPath, 'utf-8')
      assert.ok(compJs.startsWith('\'use client\''), `${name}.js must start with 'use client'`)
      assert.doesNotMatch(compJs, /from\s+['"]\..*\.tsx?['"]/, `${name}.js must rewrite relative .ts/.tsx imports to .js`)
    }
  })

  it('declares required dependencies without utility-CSS runtime packages', () => {
    assert.ok(packageJson.dependencies['@pact-design/styles'], 'must depend on @pact-design/styles')
    assert.ok(packageJson.dependencies['react-aria-components'], 'must depend on react-aria-components')
    assert.ok(packageJson.dependencies.clsx, 'must depend on clsx')
    assert.ok(packageJson.dependencies['@remixicon/react'], 'must depend on @remixicon/react')
    assert.ok(packageJson.dependencies['@internationalized/date'], 'must depend on @internationalized/date')
    assert.equal(packageJson.dependencies['tailwind-merge'], undefined, 'must not depend on tailwind-merge')
    assert.equal(packageJson.dependencies['class-variance-authority'], undefined, 'must not depend on class-variance-authority')
    assert.ok(packageJson.peerDependencies.react, 'must declare react peerDependency')
    assert.ok(packageJson.peerDependencies['react-dom'], 'must declare react-dom peerDependency')
  })

  it('exports all component barrels and core utilities from src/index.ts', () => {
    const rootIndexPath = path.join(PACKAGE_ROOT, 'src/index.ts')
    assert.ok(fs.existsSync(rootIndexPath), 'src/index.ts must exist')
    const rootIndex = fs.readFileSync(rootIndexPath, 'utf-8')

    assert.match(rootIndex, /export\s+\*\s+from\s+['"]\.\/components\/index\.ts['"]/)
    assert.match(rootIndex, /export\s+\*\s+from\s+['"]\.\/utils\/index\.ts['"]/)

    const compIndexPath = path.join(PACKAGE_ROOT, 'src/components/index.ts')
    assert.ok(fs.existsSync(compIndexPath), 'src/components/index.ts must exist')
    const compIndex = fs.readFileSync(compIndexPath, 'utf-8')

    for (const name of COMPONENTS) {
      assert.match(
        compIndex,
        new RegExp(`export\\s+\\*\\s+from\\s+['"]\\./${name}/index\\.ts['"]`),
        `src/components/index.ts must export ${name}`
      )
    }
  })

  it('verifies every component directory contains <Component>.tsx and index.ts', () => {
    for (const name of COMPONENTS) {
      const compDir = path.join(PACKAGE_ROOT, 'src/components', name)
      const indexPath = path.join(compDir, 'index.ts')
      const compPath = path.join(compDir, `${name}.tsx`)

      assert.ok(fs.existsSync(indexPath), `${name}/index.ts must exist`)
      assert.ok(fs.existsSync(compPath), `${name}/${name}.tsx must exist`)

      const compContent = fs.readFileSync(compPath, 'utf-8')
      if (!PURE_DISPLAY_COMPONENTS.has(name)) {
        assert.match(compContent, /react-aria-components/, `${name}.tsx must use react-aria-components`)
      }
    }
  })

  it('normalizes disabled and toggle props cleanly without leaking HTML aliases', () => {
    assert.equal(resolveDisabled({ disabled: true }), true)
    assert.equal(resolveDisabled({ disabled: true, isDisabled: false }), false)
    assert.equal(resolveDisabled({}), undefined)

    const onCheckedChange = () => {}
    const onChange = () => {}
    const normalized = resolveToggleProps({
      id: 'agree',
      disabled: true,
      checked: true,
      defaultChecked: false,
      onCheckedChange,
      onChange
    })

    assert.equal(normalized.id, 'agree')
    assert.equal(normalized.isDisabled, true)
    assert.equal(normalized.isSelected, true)
    assert.equal(normalized.defaultSelected, false)
    assert.equal(normalized.onChange, onChange)
    assert.equal('disabled' in normalized, false)
    assert.equal('checked' in normalized, false)
    assert.equal('defaultChecked' in normalized, false)
    assert.equal('onCheckedChange' in normalized, false)

    const fallback = resolveToggleProps({ onCheckedChange })
    assert.equal(fallback.onChange, onCheckedChange)
  })

  it('verifies all components use semantic pd-* CSS classes defined in @pact-design/styles/css', () => {
    const stylesCssPath = require.resolve('@pact-design/styles/css')
    const stylesCss = fs.readFileSync(stylesCssPath, 'utf-8')
    const definedClasses = new Set(
      Array.from(stylesCss.matchAll(/\.(pd-[a-z0-9-]+)/g), (m) => m[1])
    )
    const missing = []

    for (const name of COMPONENTS) {
      const compPath = path.join(PACKAGE_ROOT, 'src/components', name, `${name}.tsx`)
      const source = fs.readFileSync(compPath, 'utf-8')
      assert.doesNotMatch(source, /class-variance-authority/, `${name}.tsx must not depend on cva`)
      assert.doesNotMatch(source, /tailwind-merge/, `${name}.tsx must not depend on tailwind-merge`)

      const referencedClasses = Array.from(source.matchAll(/['"`]([^'"`\n]*pd-[a-z0-9-]+[^'"`\n]*)['"`]/g))
        .flatMap((m) => m[1].split(/\s+/))
        .filter((cls) => cls.startsWith('pd-'))

      assert.ok(referencedClasses.length > 0, `${name}.tsx must reference semantic pd-* CSS classes`)

      for (const cls of new Set(referencedClasses)) {
        if (!definedClasses.has(cls)) {
          missing.push(`${name}.tsx -> .${cls}`)
        }
      }
    }

    assert.deepEqual(
      missing,
      [],
      `Semantic pd-* classes referenced in @pact-design/react but missing in @pact-design/styles/css:\n${missing.join('\n')}`
    )
  })
})
