import type { Config, Dictionary } from 'style-dictionary/types'
import { cssTransformList, customTransforms } from './transforms/dtcg.ts'
import { formatThemedCss } from './formats/css.ts'
import { formatUnoPreset, formatUnoTypes } from './formats/uno.ts'

export const TOKEN_PREFIX = 'pd'
export const GENERATED_TOKENS_DIR = 'build/tokens'

export function createDarkConfig(sourceDir = GENERATED_TOKENS_DIR): Config {
  return {
    usesDtcg: true,
    source: [`${sourceDir}/**/!(*.light).json`],
    hooks: {
      transforms: customTransforms
    },
    platforms: {
      css: {
        prefix: TOKEN_PREFIX,
        transforms: cssTransformList
      }
    }
  }
}

export function createLightConfig(
  { darkDictionary, sourceDir = GENERATED_TOKENS_DIR }: { darkDictionary: Dictionary, sourceDir?: string }
): Config {
  return {
    usesDtcg: true,
    source: [`${sourceDir}/**/!(*.dark).json`],
    hooks: {
      transforms: customTransforms,
      formats: {
        'css/variables-themed': formatThemedCss,
        'uno/preset': formatUnoPreset,
        'uno/types': formatUnoTypes
      }
    },
    platforms: {
      css: {
        prefix: TOKEN_PREFIX,
        transforms: cssTransformList,
        buildPath: 'build/css/',
        files: [
          {
            destination: '_variables.css',
            format: 'css/variables-themed',
            options: {
              outputReferences: true,
              darkDictionary
            }
          }
        ]
      },
      uno: {
        prefix: TOKEN_PREFIX,
        transforms: cssTransformList,
        buildPath: 'build/uno/',
        files: [
          {
            destination: 'preset.js',
            format: 'uno/preset'
          },
          {
            destination: 'preset.d.ts',
            format: 'uno/types'
          }
        ]
      }
    }
  }
}
