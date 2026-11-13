import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { cn } from '../src/utils/cn.ts'

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
  'Disclosure',
  'TextField',
  'ComboBox',
  'DateField',
  'Field'
]

describe('@pact-design/react package integrity', () => {
  const packageJsonPath = path.join(PACKAGE_ROOT, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

  it('declares correct package name, ESM type, and exports', () => {
    assert.equal(packageJson.name, '@pact-design/react')
    assert.equal(packageJson.type, 'module')
    assert.ok(packageJson.exports, 'package.json must declare exports')
    assert.equal(packageJson.exports['.'], './src/index.ts')
    assert.equal(packageJson.exports['./components'], './src/components/index.ts')
    assert.equal(packageJson.exports['./utils'], './src/utils/index.ts')
  })

  it('declares required dependencies and peerDependencies', () => {
    assert.ok(packageJson.dependencies['@pact-design/tokens'], 'must depend on @pact-design/tokens')
    assert.ok(packageJson.dependencies['react-aria-components'], 'must depend on react-aria-components')
    assert.ok(packageJson.dependencies.clsx, 'must depend on clsx')
    assert.ok(packageJson.dependencies['tailwind-merge'], 'must depend on tailwind-merge')
    assert.ok(packageJson.dependencies['class-variance-authority'], 'must depend on class-variance-authority')
    assert.ok(packageJson.dependencies['@remixicon/react'], 'must depend on @remixicon/react')
    assert.ok(packageJson.dependencies['@internationalized/date'], 'must depend on @internationalized/date')
    assert.ok(packageJson.peerDependencies.react, 'must declare react peerDependency')
    assert.ok(packageJson.peerDependencies['react-dom'], 'must declare react-dom peerDependency')
  })

  it('exports all 12 component barrels and core utilities from src/index.ts', () => {
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
  })
})
