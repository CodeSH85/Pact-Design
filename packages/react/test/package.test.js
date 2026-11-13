import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PACKAGE_ROOT = path.resolve(__dirname, '..')

describe('@pact-design/react package integrity', () => {
  const packageJsonPath = path.join(PACKAGE_ROOT, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

  it('declares correct package name and ESM type', () => {
    assert.equal(packageJson.name, '@pact-design/react')
    assert.equal(packageJson.type, 'module')
    assert.ok(packageJson.exports, 'package.json must declare exports')
    assert.equal(packageJson.exports['.'], './src/index.js')
  })

  it('declares required dependencies and peerDependencies', () => {
    assert.ok(packageJson.dependencies['@pact-design/tokens'], 'must depend on @pact-design/tokens')
    assert.ok(packageJson.dependencies['react-aria-components'], 'must depend on react-aria-components')
    assert.ok(packageJson.peerDependencies.react, 'must declare react peerDependency')
    assert.ok(packageJson.peerDependencies['react-dom'], 'must declare react-dom peerDependency')
  })

  it('exports Button, Checkbox, and Menu from src/index.js', () => {
    const indexPath = path.join(PACKAGE_ROOT, 'src/index.js')
    assert.ok(fs.existsSync(indexPath), 'src/index.js must exist')

    const indexContent = fs.readFileSync(indexPath, 'utf-8')
    assert.match(indexContent, /export\s*\{\s*Button\s*\}\s*from\s*['"]\.\/Button\.jsx['"]/)
    assert.match(indexContent, /export\s*\{\s*Checkbox\s*\}\s*from\s*['"]\.\/Checkbox\.jsx['"]/)
    assert.match(indexContent, /export\s*\{\s*Menu\s*\}\s*from\s*['"]\.\/Menu\.jsx['"]/)
  })

  it('verifies Button.jsx integrates react-aria-components and Pact Design tokens', () => {
    const buttonPath = path.join(PACKAGE_ROOT, 'src/Button.jsx')
    assert.ok(fs.existsSync(buttonPath), 'src/Button.jsx must exist')

    const content = fs.readFileSync(buttonPath, 'utf-8')
    assert.match(content, /from\s+['"]react-aria-components['"]/)
    assert.match(content, /h-control-md/)
    assert.match(content, /bg-primary/)
    assert.match(content, /data-\[focus-visible\]:outline-border-focus/)
  })

  it('verifies Checkbox.jsx integrates react-aria-components and Pact Design tokens', () => {
    const checkboxPath = path.join(PACKAGE_ROOT, 'src/Checkbox.jsx')
    assert.ok(fs.existsSync(checkboxPath), 'src/Checkbox.jsx must exist')

    const content = fs.readFileSync(checkboxPath, 'utf-8')
    assert.match(content, /from\s+['"]react-aria-components['"]/)
    assert.match(content, /w-icon-md/)
    assert.match(content, /group-data-\[selected\]:bg-primary/)
    assert.match(content, /border-border-strong/)
  })

  it('verifies Menu.jsx integrates react-aria-components and Pact Design tokens', () => {
    const menuPath = path.join(PACKAGE_ROOT, 'src/Menu.jsx')
    assert.ok(fs.existsSync(menuPath), 'src/Menu.jsx must exist')

    const content = fs.readFileSync(menuPath, 'utf-8')
    assert.match(content, /from\s+['"]react-aria-components['"]/)
    assert.match(content, /z-dropdown/)
    assert.match(content, /bg-elevated/)
    assert.match(content, /shadow-elevation-lg/)
  })
})
