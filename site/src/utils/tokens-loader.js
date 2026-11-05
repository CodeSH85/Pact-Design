import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {
  colorValueToCss,
  colorValueToHex,
  colorValueToOklch
} from 'pact-design/utils/color.js'
import {
  apcaLevel,
  calculateAPCA,
  calculateContrast,
  readableOn
} from 'pact-design/utils/contrast.js'
import {
  cssName,
  dimensionToCss,
  flatten,
  formatValue,
  refOf,
  resolveValue,
  toPx
} from 'pact-design/utils/token.js'

function findWorkspaceRoot() {
  let dir = process.cwd()
  while (dir !== path.dirname(dir)) {
    if (fsSync.existsSync(path.join(dir, 'tokens', 'color', 'global.json'))) {
      return dir
    }
    dir = path.dirname(dir)
  }
  return path.resolve(process.cwd(), '..')
}

const WORKSPACE_ROOT = findWorkspaceRoot()
const TOKENS_ROOT = path.join(WORKSPACE_ROOT, 'tokens')

async function listJsonFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return listJsonFiles(full)
      return entry.name.endsWith('.json') ? [full] : []
    })
  )
  return nested.flat().sort()
}

let cachedData = null

export async function loadTokenCatalog() {
  if (cachedData) return cachedData

  const absFiles = await listJsonFiles(TOKENS_ROOT)
  const files = {}
  for (const abs of absFiles) {
    const rel = path.relative(path.resolve(TOKENS_ROOT, '..'), abs).split(path.sep).join('/')
    const raw = await fs.readFile(abs, 'utf-8')
    files[rel] = JSON.parse(raw)
  }

  const light = flatten(files, 'light')
  const dark = flatten(files, 'dark')

  cachedData = {
    files,
    lightTokens: light.tokens,
    darkTokens: dark.tokens
  }
  return cachedData
}

export {
  apcaLevel,
  calculateAPCA,
  calculateContrast,
  colorValueToCss,
  colorValueToHex,
  colorValueToOklch,
  cssName,
  dimensionToCss,
  formatValue,
  readableOn,
  refOf,
  resolveValue,
  toPx
}
