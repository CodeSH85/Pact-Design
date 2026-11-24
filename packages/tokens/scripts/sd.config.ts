import type { Config, DesignTokens, Dictionary } from 'style-dictionary/types'
import { formatThemedCss } from './formats/css.ts'
import { formatTokenMeta } from './formats/meta.ts'
import { cssTransformList, customTransforms } from './transforms/dtcg.ts'

export function createDarkConfig(tokens: DesignTokens): Config {
  return {
    usesDtcg: true,
    tokens,
    hooks: {
      transforms: customTransforms
    },
    platforms: {
      css: {
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
        'meta/json': formatTokenMeta
      }
    },
    platforms: {
      css: {
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
      meta: {
        transforms: cssTransformList,
        buildPath: 'build/meta/',
        files: [
          {
            destination: 'tokens.json',
            format: 'meta/json'
          }
        ]
      }
    }
  }
}
