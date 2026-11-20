import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import StyleDictionary from 'style-dictionary'
import type { DesignTokens } from 'style-dictionary/types'
import { assembleTokens, collectThemedPaths, tokenModules } from '../src/index.ts'
import { createDarkConfig, createLightConfig } from './sd.config.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGE_DIR = path.resolve(__dirname, '..')

export async function buildTokens(): Promise<void> {
  process.chdir(PACKAGE_DIR)

  const darkTokens = assembleTokens(tokenModules, 'dark') as DesignTokens
  const lightTokens = assembleTokens(tokenModules, 'light') as DesignTokens
  const themedPaths = collectThemedPaths(tokenModules)

  const darkSd = new StyleDictionary(createDarkConfig(darkTokens))
  const darkDictionary = await darkSd.getPlatformTokens('css')

  const sd = new StyleDictionary(
    createLightConfig({ tokens: lightTokens, darkDictionary, themedPaths })
  )
  await sd.buildAllPlatforms()
}

await buildTokens()
