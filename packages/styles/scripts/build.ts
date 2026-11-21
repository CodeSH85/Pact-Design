import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { bundle } from 'lightningcss'
import { formatUnoPreset, formatUnoTypes } from '../src/uno/preset.ts'
import type { TokenMetaEntry } from '../src/uno/rules.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGE_DIR = path.resolve(__dirname, '..')
const require = createRequire(import.meta.url)

const FILE_HEADER = `/**
 * Do not edit directly, this file was auto-generated.
 */
`

/**
 * Browser targets where @layer and :where() are natively supported while CSS nesting
 * is flattened to standard selectors and vendor prefixes (e.g. -webkit-user-select) are emitted.
 */
const CSS_TARGETS = {
  chrome: 109 << 16,
  firefox: 115 << 16,
  safari: 16 << 16
}

function stripLeadingComment(css: string): string {
  return css.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '').trim()
}

function indentBlock(css: string, spaces = 2): string {
  const pad = ' '.repeat(spaces)
  return css
    .split('\n')
    .map((line) => (line.length > 0 ? `${pad}${line}` : line))
    .join('\n')
}

function compileCssFile(entryPath: string): string {
  const { code } = bundle({
    filename: entryPath,
    minify: false,
    targets: CSS_TARGETS
  })
  return Buffer.from(code).toString('utf-8').trim()
}

export function buildStyles(): void {
  const tokensCssPath = require.resolve('@pact-design/tokens/css')
  const tokensMetaPath = require.resolve('@pact-design/tokens/meta')
  const themeCssPath = path.join(PACKAGE_DIR, 'src/css/theme.css')
  const resetCssPath = path.join(PACKAGE_DIR, 'src/css/reset.css')
  const componentsSrcDir = path.join(PACKAGE_DIR, 'src/components')
  const componentsIndexPath = path.join(componentsSrcDir, 'index.css')

  const rawTokensCss = fs.readFileSync(tokensCssPath, 'utf-8')
  const rawThemeCss = fs.readFileSync(themeCssPath, 'utf-8').trim()
  const tokenMeta = JSON.parse(fs.readFileSync(tokensMetaPath, 'utf-8')) as TokenMetaEntry[]

  const compiledResetCss = compileCssFile(resetCssPath)
  const compiledComponentsCss = compileCssFile(componentsIndexPath)

  const cssBuildDir = path.join(PACKAGE_DIR, 'build/css')
  const cssComponentsBuildDir = path.join(cssBuildDir, 'components')
  const unoBuildDir = path.join(PACKAGE_DIR, 'build/uno')
  fs.mkdirSync(cssComponentsBuildDir, { recursive: true })
  fs.mkdirSync(unoBuildDir, { recursive: true })

  const tokensBody = stripLeadingComment(rawTokensCss)
  fs.writeFileSync(path.join(cssBuildDir, 'tokens.css'), `${FILE_HEADER}\n${tokensBody}\n`, 'utf-8')
  fs.writeFileSync(path.join(cssBuildDir, 'theme.css'), `${FILE_HEADER}\n${rawThemeCss}\n`, 'utf-8')
  fs.writeFileSync(path.join(cssBuildDir, 'reset.css'), `${FILE_HEADER}\n${compiledResetCss}\n`, 'utf-8')
  fs.writeFileSync(
    path.join(cssBuildDir, 'components.css'),
    `${FILE_HEADER}\n${compiledComponentsCss}\n`,
    'utf-8'
  )

  // Emit individual compiled component stylesheets for granular imports
  for (const entry of fs.readdirSync(componentsSrcDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.css') || entry.name === 'index.css') continue
    const compiledSingle = compileCssFile(path.join(componentsSrcDir, entry.name))
    fs.writeFileSync(
      path.join(cssComponentsBuildDir, entry.name),
      `${FILE_HEADER}\n${compiledSingle}\n`,
      'utf-8'
    )
  }

  const indexOutput = [
    FILE_HEADER.trimEnd(),
    '',
    '@layer pact.tokens, pact.theme, pact.reset, pact.components;',
    '',
    '@layer pact.tokens {',
    indentBlock(tokensBody),
    '}',
    '',
    '@layer pact.theme {',
    indentBlock(rawThemeCss),
    '}',
    '',
    '@layer pact.reset {',
    indentBlock(compiledResetCss),
    '}',
    '',
    '@layer pact.components {',
    indentBlock(compiledComponentsCss),
    '}',
    ''
  ].join('\n')
  fs.writeFileSync(path.join(cssBuildDir, 'index.css'), indexOutput, 'utf-8')

  fs.writeFileSync(
    path.join(unoBuildDir, 'preset.js'),
    formatUnoPreset(tokenMeta, rawThemeCss),
    'utf-8'
  )
  fs.writeFileSync(
    path.join(unoBuildDir, 'preset.d.ts'),
    formatUnoTypes(),
    'utf-8'
  )
}

buildStyles()
