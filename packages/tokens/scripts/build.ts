import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import StyleDictionary from 'style-dictionary'
import type { DesignTokens } from 'style-dictionary/types'
import { tokens } from '../src/index.ts'
import { collectThemedPaths, resolveTheme } from '../utils/theme.js'
import { createDarkConfig, createLightConfig } from './sd.config.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGE_DIR = path.resolve(__dirname, '..')

export async function buildTokens(): Promise<void> {
  process.chdir(PACKAGE_DIR)

  const darkTokens = resolveTheme(tokens, 'dark') as DesignTokens
  const lightTokens = resolveTheme(tokens, 'light') as DesignTokens
  const themedPaths = collectThemedPaths(tokens)

  const darkSd = new StyleDictionary(createDarkConfig(darkTokens))
  const darkDictionary = await darkSd.getPlatformTokens('css')

  const sd = new StyleDictionary(
    createLightConfig({ tokens: lightTokens, darkDictionary, themedPaths })
  )
  await sd.buildAllPlatforms()
}

await buildTokens()
