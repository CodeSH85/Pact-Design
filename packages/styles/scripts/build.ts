import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { formatUnoPreset, formatUnoTypes } from '../src/uno/preset.ts'
import type { TokenMetaEntry } from '../src/uno/rules.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGE_DIR = path.resolve(__dirname, '..')
const require = createRequire(import.meta.url)

const FILE_HEADER = `/**
 * Do not edit directly, this file was auto-generated.
 */
`

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

export function buildStyles(): void {
  const tokensCssPath = require.resolve('@pact-design/tokens/css')
  const tokensMetaPath = require.resolve('@pact-design/tokens/meta')
  const themeCssPath = path.join(PACKAGE_DIR, 'src/css/theme.css')

  const rawTokensCss = fs.readFileSync(tokensCssPath, 'utf-8')
  const rawThemeCss = fs.readFileSync(themeCssPath, 'utf-8').trim()
  const tokenMeta = JSON.parse(fs.readFileSync(tokensMetaPath, 'utf-8')) as TokenMetaEntry[]

  const cssBuildDir = path.join(PACKAGE_DIR, 'build/css')
  const unoBuildDir = path.join(PACKAGE_DIR, 'build/uno')
  fs.mkdirSync(cssBuildDir, { recursive: true })
  fs.mkdirSync(unoBuildDir, { recursive: true })

  const themeOutput = `${FILE_HEADER}\n${rawThemeCss}\n`
  fs.writeFileSync(path.join(cssBuildDir, 'theme.css'), themeOutput, 'utf-8')

  const tokensBody = stripLeadingComment(rawTokensCss)
  const indexOutput = [
    FILE_HEADER.trimEnd(),
    '',
    '@layer pact.tokens, pact.theme;',
    '',
    '@layer pact.tokens {',
    indentBlock(tokensBody),
    '}',
    '',
    '@layer pact.theme {',
    indentBlock(rawThemeCss),
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
