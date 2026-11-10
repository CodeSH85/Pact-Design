import { fileHeader } from 'style-dictionary/utils'

export { transform as UnoCssTransformer }

/**
 * Dynamically extract UnoCSS / Tailwind theme configuration from Style Dictionary's token dictionary.
 * No hardcoded token names or scale values: whenever a token is added or updated in `tokens/**\/*.json`,
 * it automatically maps to its corresponding CSS Custom Property `var(--<token.name>)`.
 */
function extractDynamicTheme(allTokens) {
  const theme = {
    colors: {},
    spacing: {},
    width: {},
    height: {},
    minHeight: {},
    borderRadius: {},
    borderWidth: {},
    lineWidth: {},
    boxShadow: {},
    zIndex: {},
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
    duration: {},
    easing: {}
  }

  for (const token of allTokens) {
    const [tier, category, ...rest] = token.path
    const varRef = `var(--${token.name})`
    const key = rest.join('-')
    const tokenType = token.$type ?? token.type

    if (tier === 'system') {
      if (category === 'semantic') {
        theme.colors[key] = varRef
      } else if (category === 'background') {
        theme.colors[key] = varRef
      } else if (category === 'on-surface') {
        theme.colors[`on-surface-${key}`] = varRef
        if (key === 'default') {
          theme.colors['on-surface'] = varRef
        }
      } else if (category === 'text') {
        theme.colors[`text-${key}`] = varRef
      } else if (category === 'border') {
        if (rest[0] === 'width') {
          const widthKey = rest.slice(1).join('-')
          theme.borderWidth[widthKey] = varRef
          theme.lineWidth[widthKey] = varRef
          if (widthKey === 'sm') {
            theme.borderWidth.DEFAULT = varRef
            theme.lineWidth.DEFAULT = varRef
          }
        } else {
          theme.colors[`border-${key}`] = varRef
        }
      } else if (category === 'spacing') {
        theme.spacing[key] = varRef
      } else if (category === 'size') {
        const sizeKey = `size-${key}`
        theme.spacing[sizeKey] = varRef
        theme.width[sizeKey] = varRef
        theme.height[sizeKey] = varRef
      } else if (category === 'control' && rest[0] === 'height') {
        const controlKey = `control-${rest.slice(1).join('-')}`
        theme.spacing[controlKey] = varRef
        theme.height[controlKey] = varRef
        theme.minHeight[controlKey] = varRef
        theme.width[controlKey] = varRef
      } else if (category === 'icon' && rest[0] === 'size') {
        const iconKey = `icon-${rest.slice(1).join('-')}`
        theme.spacing[iconKey] = varRef
        theme.width[iconKey] = varRef
        theme.height[iconKey] = varRef
      } else if (category === 'radius') {
        theme.borderRadius[key] = varRef
      } else if (category === 'elevation' && tokenType === 'shadow') {
        theme.boxShadow[`elevation-${key}`] = varRef
      } else if (category === 'z-index') {
        theme.zIndex[key] = varRef
      } else if (category === 'motion') {
        if (rest[0] === 'duration') theme.duration[rest.slice(1).join('-')] = varRef
        if (rest[0] === 'easing') theme.easing[rest.slice(1).join('-')] = varRef
      } else if (category === 'font' && tokenType === 'typography') {
        theme.fontSize[key] = [
          `var(--${token.name}-font-size)`,
          {
            'line-height': `var(--${token.name}-line-height)`,
            'letter-spacing': `var(--${token.name}-letter-spacing)`,
            'font-weight': `var(--${token.name}-font-weight)`,
            'font-family': `var(--${token.name}-font-family)`
          }
        ]
      }
    } else if (tier === 'global') {
      if (['white', 'black'].includes(category)) {
        theme.colors[category] = varRef
      } else if (category === 'font') {
        const subCategory = rest[0]
        const subKey = rest.slice(1).join('-')
        if (subCategory === 'family') {
          theme.fontFamily[subKey] = varRef
        } else if (subCategory === 'size') {
          theme.fontSize[`size-${subKey}`] = varRef
        } else if (subCategory === 'weight') {
          theme.fontWeight[subKey] = varRef
        } else if (subCategory === 'line' && rest[1] === 'height') {
          theme.lineHeight[rest.slice(2).join('-')] = varRef
        } else if (subCategory === 'line-height') {
          theme.lineHeight[subKey] = varRef
        } else if (subCategory === 'letter' && rest[1] === 'spacing') {
          theme.letterSpacing[rest.slice(2).join('-')] = varRef
        } else if (subCategory === 'letter-spacing') {
          theme.letterSpacing[subKey] = varRef
        }
      } else if (tokenType === 'color') {
        const scaleKebab = category.replace(/([A-Z])/g, '-$1').toLowerCase()
        theme.colors[`${scaleKebab}-${key}`] = varRef
      }
    }
  }

  return theme
}

async function transform({ dictionary, file }) {
  const header = await fileHeader({ file })
  const dynamicTheme = extractDynamicTheme(dictionary.allTokens)

  const presetContent = {
    name: 'pact-design-preset',
    theme: dynamicTheme
  }

  return `${header}
  /**
   * Pact Design Token Preset for UnoCSS & Tailwind CSS
   * Dynamically generated from tokens JSON files.
   * Maps semantic tokens directly to CSS Custom Properties (var(--*)).
   */
  export const pactTheme = ${JSON.stringify(presetContent.theme, null, 2)}

  export function pactPreset() {
    return {
      name: 'pact-design',
      theme: pactTheme
    }
  }

  export default pactPreset
  `
}
