import type { Config, DesignTokens, Dictionary } from 'style-dictionary/types'
import { cssTransformList, customTransforms } from './transforms/dtcg.ts'
import { formatThemedCss } from './formats/css.ts'
import { formatUnoPreset, formatUnoTypes } from './formats/uno.ts'

export const TOKEN_PREFIX = 'pd'

export function createDarkConfig(tokens: DesignTokens): Config {
  return {
    usesDtcg: true,
    tokens,
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
  {
    tokens,
    darkDictionary,
    themedPaths
  }: {
    tokens: DesignTokens
    darkDictionary: Dictionary
    themedPaths: ReadonlySet<string>
  }
): Config {
  return {
    usesDtcg: true,
    tokens,
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
              darkDictionary,
              themedPaths
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
