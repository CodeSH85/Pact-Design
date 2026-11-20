import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import StyleDictionary from 'style-dictionary'
import { generateDtcgJson } from './generate-tokens.ts'
import { createDarkConfig, createLightConfig, GENERATED_TOKENS_DIR } from './sd.config.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGE_DIR = path.resolve(__dirname, '..')

export async function buildTokens(): Promise<void> {
  process.chdir(PACKAGE_DIR)

  await generateDtcgJson({ outDir: GENERATED_TOKENS_DIR })

  const darkSd = new StyleDictionary(createDarkConfig(GENERATED_TOKENS_DIR))
  const darkDictionary = await darkSd.getPlatformTokens('css')

  const sd = new StyleDictionary(
    createLightConfig({ darkDictionary, sourceDir: GENERATED_TOKENS_DIR })
  )
  await sd.buildAllPlatforms()
}

await buildTokens()
