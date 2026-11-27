import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  resolveClearable,
  resolveDisableableProps,
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

const DISABLEABLE_COMPONENTS = [
  'Autocomplete',
  'Breadcrumbs',
  'Button',
  'Calendar',
  'Checkbox',
  'ComboBox',
  'DateField',
  'DatePicker',
  'Disclosure',
  'DisclosureGroup',
  'Field',
  'FileTrigger',
  'ListBox',
  'Menu',
  'Radio',
  'SearchField',
  'Select',
  'Slider',
  'Switch',
  'Tab',
  'TextField',
  'ToggleButton',
  'Tooltip',
  'Tree'
]

function walkFiles(dir) {
  const result = []
  if (!fs.existsSync(dir)) return result
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      result.push(...walkFiles(fullPath))
    } else {
      result.push(fullPath)
    }
  }
  return result
}

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
    assert.ok(fs.existsSync(path.join(distRoot, 'icons/index.js')), 'dist/icons/index.js must exist')
    assert.ok(fs.existsSync(path.join(distRoot, 'icons/defaults.js')), 'dist/icons/defaults.js must exist')
    assert.ok(fs.existsSync(path.join(distRoot, 'utils/index.js')), 'dist/utils/index.js must exist')
    assert.ok(fs.existsSync(path.join(distRoot, 'utils/index.d.ts')), 'dist/utils/index.d.ts must exist')
    assert.equal(
      fs.existsSync(path.join(distRoot, 'components', 'Dialog')),
      false,
      'Dialog must be internalized and not emitted under dist/components/Dialog'
    )

    const distStylesPath = path.join(distRoot, 'styles.css')
    assert.ok(fs.existsSync(distStylesPath), 'dist/styles.css must exist')
    const distStyles = fs.readFileSync(distStylesPath, 'utf-8')
    assert.match(distStyles, /--pd-system-color-surface-base:/)
    assert.match(distStyles, /:where\(\.pd-reset\)/)
    assert.match(distStyles, /\.pd-button\s*\{/)
    assert.match(distStyles, /::-webkit-search-cancel-button/)

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

  it('tree-shakes @remixicon/react at build time and excludes it from published runtime dependencies', () => {
    assert.ok(packageJson.dependencies['@pact-design/styles'], 'must depend on @pact-design/styles')
    assert.ok(packageJson.dependencies['react-aria-components'], 'must depend on react-aria-components')
    assert.ok(packageJson.dependencies.clsx, 'must depend on clsx')
    assert.ok(packageJson.dependencies['@internationalized/date'], 'must depend on @internationalized/date')
    assert.equal(packageJson.dependencies['@remixicon/react'], undefined, 'must not list @remixicon/react in runtime dependencies')
    assert.ok(packageJson.devDependencies['@remixicon/react'], 'must keep @remixicon/react in devDependencies for build-time icon tree-shaking')
    assert.equal(packageJson.dependencies['tailwind-merge'], undefined, 'must not depend on tailwind-merge')
    assert.equal(packageJson.dependencies['class-variance-authority'], undefined, 'must not depend on class-variance-authority')
    assert.ok(packageJson.peerDependencies.react, 'must declare react peerDependency')
    assert.ok(packageJson.peerDependencies['react-dom'], 'must declare react-dom peerDependency')

    const distRoot = path.join(PACKAGE_ROOT, 'dist')
    const defaultsSize = fs.statSync(path.join(distRoot, 'icons/defaults.js')).size
    assert.ok(defaultsSize < 20_000, `dist/icons/defaults.js should be compact after tree-shaking (got ${defaultsSize} bytes)`)

    for (const filePath of walkFiles(distRoot)) {
      if (!filePath.endsWith('.js') && !filePath.endsWith('.d.ts')) continue
      const content = fs.readFileSync(filePath, 'utf-8')
      assert.doesNotMatch(
        content,
        /from\s+['"]@remixicon\/react['"]/,
        `${path.relative(distRoot, filePath)} must not import @remixicon/react at runtime or in declarations`
      )
    }
  })

  it('exports all public component barrels, icon helpers, and utilities from src/index.ts without Dialog', () => {
    const rootIndexPath = path.join(PACKAGE_ROOT, 'src/index.ts')
    assert.ok(fs.existsSync(rootIndexPath), 'src/index.ts must exist')
    const rootIndex = fs.readFileSync(rootIndexPath, 'utf-8')

    assert.match(rootIndex, /export\s+\*\s+from\s+['"]\.\/components\/index\.ts['"]/)
    assert.match(rootIndex, /export\s+\*\s+from\s+['"]\.\/icons\/index\.ts['"]/)
    assert.match(rootIndex, /export\s+\*\s+from\s+['"]\.\/utils\/index\.ts['"]/)

    const compIndexPath = path.join(PACKAGE_ROOT, 'src/components/index.ts')
    assert.ok(fs.existsSync(compIndexPath), 'src/components/index.ts must exist')
    const compIndex = fs.readFileSync(compIndexPath, 'utf-8')

    assert.doesNotMatch(compIndex, /['"]\.\/Dialog\/index\.ts['"]/, 'Dialog must not be exported from src/components/index.ts')

    for (const name of COMPONENTS) {
      assert.match(
        compIndex,
        new RegExp(`export\\s+\\*\\s+from\\s+['"]\\./${name}/index\\.ts['"]`),
        `src/components/index.ts must export ${name}`
      )
    }
  })

  it('verifies every component directory contains <Component>.tsx and index.ts and supports disabled/isDisabled parity', () => {
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

      if (DISABLEABLE_COMPONENTS.includes(name)) {
        assert.match(
          compContent,
          /DisableableProps|SelectionControlProps|ToggleControlProps/,
          `${name}.tsx must support both disabled and isDisabled via shared props`
        )
      }
    }
  })

  it('normalizes disabled, toggle, and clearable props cleanly without leaking HTML aliases', () => {
    assert.equal(resolveDisabled({ disabled: true }), true)
    assert.equal(resolveDisabled({ disabled: true, isDisabled: false }), false)
    assert.equal(resolveDisabled({}), undefined)

    const disableable = resolveDisableableProps({ id: 'role', disabled: true })
    assert.equal(disableable.id, 'role')
    assert.equal(disableable.isDisabled, true)
    assert.equal('disabled' in disableable, false)

    const undefDisableable = resolveDisableableProps({ id: 'active' })
    assert.equal(undefDisableable.id, 'active')
    assert.equal('isDisabled' in undefDisableable, false)

    assert.deepEqual(resolveClearable(undefined, false), { enabled: false, label: 'Clear' })
    assert.deepEqual(resolveClearable(undefined, true), { enabled: true, label: 'Clear' })
    assert.deepEqual(resolveClearable(false, true), { enabled: false, label: 'Clear' })
    assert.deepEqual(resolveClearable(true, false), { enabled: true, label: 'Clear' })
    const customOnClear = () => {}
    assert.deepEqual(resolveClearable({ icon: 'x', label: 'Reset', onClear: customOnClear }, false), {
      enabled: true,
      icon: 'x',
      label: 'Reset',
      onClear: customOnClear
    })

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
    const definedClasses = new Set([
      ...Array.from(stylesCss.matchAll(/\.(pd-[a-z0-9-]+)/g), (m) => m[1]),
      ...Array.from(stylesCss.matchAll(/@keyframes\s+(pd-[a-z0-9-]+)/g), (m) => m[1])
    ])
    const missing = []
    const filesToCheck = [
      ...COMPONENTS.map((name) => path.join(PACKAGE_ROOT, 'src/components', name, `${name}.tsx`)),
      path.join(PACKAGE_ROOT, 'src/internal/Dialog/Dialog.tsx'),
      path.join(PACKAGE_ROOT, 'src/internal/FieldChrome.tsx')
    ]

    for (const compPath of filesToCheck) {
      const source = fs.readFileSync(compPath, 'utf-8')
      const rel = path.relative(PACKAGE_ROOT, compPath)
      assert.doesNotMatch(source, /class-variance-authority/, `${rel} must not depend on cva`)
      assert.doesNotMatch(source, /tailwind-merge/, `${rel} must not depend on tailwind-merge`)
      assert.doesNotMatch(source, /@remixicon\/react/, `${rel} must use renderIcon instead of importing @remixicon/react directly`)

      const referencedClasses = Array.from(source.matchAll(/['"`]([^'"`\n]*pd-[a-z0-9-]+[^'"`\n]*)['"`]/g))
        .flatMap((m) => m[1].split(/\s+/))
        .filter((cls) => cls.startsWith('pd-'))

      assert.ok(referencedClasses.length > 0, `${rel} must reference semantic pd-* CSS classes`)

      for (const cls of new Set(referencedClasses)) {
        if (!definedClasses.has(cls)) {
          missing.push(`${rel} -> .${cls}`)
        }
      }
    }

    assert.deepEqual(
      missing,
      [],
      `Semantic pd-* classes referenced in @pact-design/react but missing in @pact-design/styles/css:\n${missing.join('\n')}`
    )
  })

  it('composes Pact Design atomic Button and Separator instead of raw React Aria primitives', () => {
    const allowedRawAriaButton = new Set([
      'src/components/Button/Button.tsx'
    ])
    const allowedRawAriaSeparator = new Set([
      'src/components/Separator/Separator.tsx'
    ])
    const violations = []
    const filesToCheck = [
      ...COMPONENTS.map((name) => path.join(PACKAGE_ROOT, 'src/components', name, `${name}.tsx`)),
      path.join(PACKAGE_ROOT, 'src/internal/Dialog/Dialog.tsx'),
      path.join(PACKAGE_ROOT, 'src/internal/FieldChrome.tsx')
    ]

    for (const compPath of filesToCheck) {
      const rel = path.relative(PACKAGE_ROOT, compPath)
      const source = fs.readFileSync(compPath, 'utf-8')
      if (!allowedRawAriaButton.has(rel) && /\bButton\s+as\s+AriaButton\b/.test(source)) {
        violations.push(`${rel} imports raw AriaButton instead of Pact Button`)
      }
      if (!allowedRawAriaSeparator.has(rel) && /\bSeparator\s+as\s+AriaSeparator\b/.test(source)) {
        violations.push(`${rel} imports raw AriaSeparator instead of Pact Separator`)
      }
    }

    assert.deepEqual(violations, [], `Atomic composition violations:\n${violations.join('\n')}`)
  })
})
