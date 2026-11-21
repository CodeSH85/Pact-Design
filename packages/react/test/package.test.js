import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { pactTheme } from '@pact-design/styles/uno'
import {
  cn,
  collectionItemVariants,
  resolveDisabled,
  resolveToggleProps,
  selectionControlDescriptionClasses,
  selectionControlLabelClasses
} from '../src/utils/index.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PACKAGE_ROOT = path.resolve(__dirname, '..')

const COMPONENTS = [
  'Button',
  'ToggleButton',
  'Checkbox',
  'Switch',
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
  'Field',
  'Radio',
  'Separator',
  'Sheet',
  'Tree'
]

describe('@pact-design/react package integrity', () => {
  const packageJsonPath = path.join(PACKAGE_ROOT, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

  it('declares correct package name, ESM type, and exports', () => {
    assert.equal(packageJson.name, '@pact-design/react')
    assert.equal(packageJson.type, 'module')
    assert.ok(packageJson.exports, 'package.json must declare exports')
    assert.equal(packageJson.exports['.'], './src/index.ts')
    assert.equal(packageJson.exports['./styles.css'], './src/styles.css')
    assert.equal(packageJson.exports['./components'], './src/components/index.ts')
    assert.equal(packageJson.exports['./utils'], './src/utils/index.ts')
    assert.ok(fs.existsSync(path.join(PACKAGE_ROOT, 'src/styles.css')), 'src/styles.css must exist')
  })

  it('declares required dependencies and peerDependencies', () => {
    assert.ok(packageJson.dependencies['@pact-design/styles'], 'must depend on @pact-design/styles')
    assert.ok(packageJson.dependencies['react-aria-components'], 'must depend on react-aria-components')
    assert.ok(packageJson.dependencies.clsx, 'must depend on clsx')
    assert.ok(packageJson.dependencies['tailwind-merge'], 'must depend on tailwind-merge')
    assert.ok(packageJson.dependencies['class-variance-authority'], 'must depend on class-variance-authority')
    assert.ok(packageJson.dependencies['@remixicon/react'], 'must depend on @remixicon/react')
    assert.ok(packageJson.dependencies['@internationalized/date'], 'must depend on @internationalized/date')
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
      assert.match(compContent, /react-aria-components/, `${name}.tsx must use react-aria-components`)
    }
  })

  it('verifies cn() resolves Pact Design token conflicts dynamically', () => {
    // Control heights: h-control-md should be replaced by h-control-xs
    assert.equal(
      cn('h-control-md px-md', 'h-control-xs'),
      'px-md h-control-xs'
    )

    // Typography scales: text-label-md should be replaced by text-label-sm
    assert.equal(
      cn('text-label-md font-medium', 'text-label-sm'),
      'font-medium text-label-sm'
    )

    // Semantic background colors: bg-layer-1 should be replaced by bg-primary
    assert.equal(
      cn('bg-layer-1 text-on-surface', 'bg-primary text-on-primary'),
      'bg-primary text-on-primary'
    )

    // Radii: rounded-sm should be replaced by rounded-md
    assert.equal(
      cn('rounded-sm border', 'rounded-md'),
      'border rounded-md'
    )

    // Shadows: shadow-elevation-sm should be replaced by shadow-elevation-lg
    assert.equal(
      cn('shadow-elevation-sm', 'shadow-elevation-lg'),
      'shadow-elevation-lg'
    )

    // Min/Max sizing: token values and arbitrary values resolve conflicts cleanly
    assert.equal(
      cn('min-w-popover-surface', 'min-w-[var(--trigger-width)]'),
      'min-w-[var(--trigger-width)]'
    )
    assert.equal(
      cn('max-w-modal-content-md', 'max-w-modal-content-lg'),
      'max-w-modal-content-lg'
    )
    assert.equal(
      cn('max-h-60', 'max-h-popover-listbox'),
      'max-h-popover-listbox'
    )
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

  it('builds consistent shared collection item and selection control style presets', () => {
    assert.match(collectionItemVariants(), /text-popover-item-text/)
    assert.match(collectionItemVariants({ tone: 'danger' }), /text-popover-item-text-danger/)
    assert.match(selectionControlLabelClasses(false), /text-on-surface\b/)
    assert.match(selectionControlLabelClasses(true), /text-on-surface-disabled/)
    assert.match(selectionControlDescriptionClasses(false), /text-on-surface-muted/)
    assert.match(selectionControlDescriptionClasses(true), /text-on-surface-disabled/)
  })

  it('verifies migrated components use semantic pd-* CSS classes and data-* attributes without cva/cn', () => {
    const buttonLike = [
      ['Button/Button.tsx', 'pd-button'],
      ['ToggleButton/ToggleButton.tsx', 'pd-toggle-button']
    ]

    for (const [relPath, className] of buttonLike) {
      const source = fs.readFileSync(path.join(PACKAGE_ROOT, 'src/components', relPath), 'utf-8')
      assert.ok(source.includes('\'pd-reset\''), `${relPath} must apply scoped pd-reset`)
      assert.ok(source.includes(`'${className}'`), `${relPath} must apply ${className}`)
      assert.match(source, /data-variant=/, `${relPath} must forward data-variant`)
      assert.match(source, /data-size=/, `${relPath} must forward data-size`)
      assert.match(source, /data-radius=/, `${relPath} must forward data-radius`)
      assert.doesNotMatch(source, /class-variance-authority/, `${relPath} must not depend on cva`)
      assert.doesNotMatch(source, /composeTailwindRenderProps/, `${relPath} must not depend on tailwind-merge`)
    }

    const phase2 = [
      ['Checkbox/Checkbox.tsx', 'pd-checkbox'],
      ['Radio/Radio.tsx', 'pd-radio'],
      ['Switch/Switch.tsx', 'pd-switch'],
      ['Separator/Separator.tsx', 'pd-separator'],
      ['TextField/TextField.tsx', 'pd-field'],
      ['SearchField/SearchField.tsx', 'pd-search-field'],
      ['FileTrigger/FileTrigger.tsx', 'pd-field-icon'],
      ['Form/Form.tsx', 'pd-form'],
      ['Tab/Tab.tsx', 'pd-tabs'],
      ['Breadcrumbs/Breadcrumbs.tsx', 'pd-breadcrumbs'],
      ['Disclosure/Disclosure.tsx', 'pd-disclosure'],
      ['DisclosureGroup/DisclosureGroup.tsx', 'pd-disclosure-group'],
      ['ListBox/ListBox.tsx', 'pd-listbox'],
      ['Tree/Tree.tsx', 'pd-tree']
    ]

    for (const [relPath, className] of phase2) {
      const source = fs.readFileSync(path.join(PACKAGE_ROOT, 'src/components', relPath), 'utf-8')
      assert.ok(source.includes(className), `${relPath} must apply ${className}`)
      assert.doesNotMatch(source, /class-variance-authority/, `${relPath} must not depend on cva`)
      assert.doesNotMatch(source, /composeTailwindRenderProps/, `${relPath} must not depend on tailwind-merge`)
    }

    const fieldSource = fs.readFileSync(path.join(PACKAGE_ROOT, 'src/components/Field/Field.tsx'), 'utf-8')
    for (const cls of ['pd-field-label', 'pd-field-description', 'pd-field-error', 'pd-field-group', 'pd-field-input', 'pd-field-button']) {
      assert.ok(fieldSource.includes(cls), `Field.tsx must apply ${cls}`)
    }
  })

  it('verifies every component token, radius, and shadow utility in src/ resolves in pactTheme', () => {
    const srcRoot = path.join(PACKAGE_ROOT, 'src')
    const componentNamespaces = new Set([
      'button',
      'checkbox',
      'disclosure',
      'field',
      'modal',
      'popover',
      'radio',
      'switch',
      'tab',
      'toast'
    ])

    const prefixToSlots = [
      ['translate-x-', ['spacing']],
      ['translate-y-', ['spacing']],
      ['min-w-', ['minWidth', 'spacing']],
      ['max-w-', ['maxWidth', 'spacing']],
      ['min-h-', ['minHeight', 'spacing']],
      ['max-h-', ['maxHeight', 'spacing']],
      ['gap-x-', ['spacing']],
      ['gap-y-', ['spacing']],
      ['rounded-', ['borderRadius']],
      ['shadow-', ['boxShadow']],
      ['border-', ['colors', 'borderWidth']],
      ['outline-', ['colors']],
      ['divide-', ['colors']],
      ['stroke-', ['colors']],
      ['ring-', ['colors', 'ringWidth']],
      ['fill-', ['colors']],
      ['text-', ['colors', 'fontSize']],
      ['bg-', ['colors']],
      ['gap-', ['spacing']],
      ['px-', ['spacing']],
      ['py-', ['spacing']],
      ['pt-', ['spacing']],
      ['pb-', ['spacing']],
      ['pl-', ['spacing']],
      ['pr-', ['spacing']],
      ['mx-', ['spacing']],
      ['my-', ['spacing']],
      ['mt-', ['spacing']],
      ['mb-', ['spacing']],
      ['ml-', ['spacing']],
      ['mr-', ['spacing']],
      ['p-', ['spacing']],
      ['m-', ['spacing']],
      ['h-', ['height', 'spacing']],
      ['w-', ['width', 'spacing']],
      ['z-', ['zIndex']]
    ]

    function collectFiles(dir) {
      const result = []
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          result.push(...collectFiles(fullPath))
        } else if (/\.(ts|tsx)$/.test(entry.name) && entry.name !== 'cn.ts') {
          result.push(fullPath)
        }
      }
      return result
    }

    const unresolved = []
    const stringLiteralRe = /['"`]([^'"`\n]+)['"`]/g

    for (const filePath of collectFiles(srcRoot)) {
      const relPath = path.relative(srcRoot, filePath)
      const source = fs.readFileSync(filePath, 'utf-8')

      for (const match of source.matchAll(stringLiteralRe)) {
        for (const rawToken of match[1].split(/\s+/)) {
          if (!rawToken || rawToken.includes('${') || rawToken.includes('(')) continue

          const base = rawToken.split(':').pop()?.replace(/^-/, '')
          if (!base) continue

          const matchedPrefix = prefixToSlots.find(([prefix]) => base.startsWith(prefix))
          if (!matchedPrefix) continue

          const [prefix, slots] = matchedPrefix
          let key = base.slice(prefix.length)
          if (!key || key.startsWith('[')) continue

          if (prefix === 'rounded-') {
            key = key.replace(/^(?:tl|tr|bl|br|ss|se|es|ee|[tblrse])-/, '')
            if (!(key in pactTheme.borderRadius)) {
              unresolved.push(`${relPath}: ${rawToken} (missing borderRadius.${key})`)
            }
            continue
          }

          if (prefix === 'shadow-') {
            if (key !== 'none' && !(key in pactTheme.boxShadow)) {
              unresolved.push(`${relPath}: ${rawToken} (missing boxShadow.${key})`)
            }
            continue
          }

          const firstSegment = key.split('-')[0]
          if (!componentNamespaces.has(firstSegment)) continue

          const exists = slots.some((slot) => key in pactTheme[slot])
          if (!exists) {
            unresolved.push(`${relPath}: ${rawToken} (missing ${slots.join('|')}.${key})`)
          }
        }
      }
    }

    assert.deepEqual(
      unresolved,
      [],
      `Unresolved Pact token utility classes in @pact-design/react:\n${unresolved.join('\n')}`
    )
  })
})
