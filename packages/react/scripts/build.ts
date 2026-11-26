import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rolldown } from 'rolldown'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGE_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.join(PACKAGE_DIR, 'dist')
const require = createRequire(import.meta.url)

function prependUseClient(dir: string): void {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      prependUseClient(fullPath)
      continue
    }
    if (!entry.name.endsWith('.js')) continue
    const code = fs.readFileSync(fullPath, 'utf-8')
    if (code.startsWith('\'use client\'') || code.startsWith('"use client"')) continue
    fs.writeFileSync(fullPath, `'use client'\n${code}`, 'utf-8')
  }
}

async function bundleDefaultIcons(): Promise<void> {
  const defaultsJsPath = path.join(DIST_DIR, 'icons', 'defaults.js')
  if (!fs.existsSync(defaultsJsPath)) return

  const bundle = await rolldown({
    input: defaultsJsPath,
    external: ['react', /^react\//],
    treeshake: true
  })

  await bundle.write({
    file: defaultsJsPath,
    format: 'es',
    sourcemap: false,
    banner: '/* Default UI icons tree-shaken from @remixicon/react (Remix Icon License 1.0) */'
  })

  await bundle.close()

  // Remove stale tsc sourcemap referencing @remixicon/react
  const mapPath = `${defaultsJsPath}.map`
  if (fs.existsSync(mapPath)) {
    fs.rmSync(mapPath)
  }
}

export async function buildReact(): Promise<void> {
  fs.rmSync(DIST_DIR, { recursive: true, force: true })

  const tscBin = path.join(PACKAGE_DIR, 'node_modules/.bin/tsc')
  execFileSync(tscBin, ['-p', path.join(PACKAGE_DIR, 'tsconfig.build.json')], {
    cwd: PACKAGE_DIR,
    stdio: 'inherit'
  })

  // Tree-shake @remixicon/react down to only the default icons used by Pact Design
  await bundleDefaultIcons()

  // Emit self-contained compiled stylesheet for zero-config consumer imports
  const stylesCssPath = require.resolve('@pact-design/styles/css')
  fs.copyFileSync(stylesCssPath, path.join(DIST_DIR, 'styles.css'))

  // Mark compiled runtime modules as React Server Components client modules
  prependUseClient(path.join(DIST_DIR, 'components'))
  prependUseClient(path.join(DIST_DIR, 'icons'))
  prependUseClient(path.join(DIST_DIR, 'internal'))
}

await buildReact()
