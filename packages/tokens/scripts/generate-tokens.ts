import fs from 'node:fs/promises'
import path from 'node:path'
import { splitModes } from '../src/dsl/themed.ts'
import { tokenModules } from '../src/index.ts'
import { stringifyTokens } from '../utils/token.js'

export interface GenerateTokensOptions {
  outDir: string
}

/**
 * Compiles TypeScript token definitions in `src/` into standard W3C DTCG JSON
 * files under `outDir`, automatically splitting `themed()` tokens into
 * `*.light.json` and `*.dark.json` files alongside shared `*.json` files.
 */
export async function generateDtcgJson({ outDir }: GenerateTokensOptions): Promise<string[]> {
  await fs.rm(outDir, { recursive: true, force: true })
  const written: string[] = []

  for (const [moduleKey, tree] of Object.entries(tokenModules)) {
    const { base, light, dark } = splitModes(tree)

    const outputs: Array<[string, Record<string, unknown> | null]> = [
      [`${moduleKey}.json`, base],
      [`${moduleKey}.light.json`, light],
      [`${moduleKey}.dark.json`, dark]
    ]

    for (const [relFile, data] of outputs) {
      if (!data) continue
      const targetPath = path.join(outDir, relFile)
      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.writeFile(targetPath, `${stringifyTokens(data)}\n`, 'utf-8')
      written.push(relFile)
    }
  }

  return written
}
