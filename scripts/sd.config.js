export default {
  usesDtcg: true,
  source: ['tokens/**/*.json'],
  hooks: {
    transforms: {
      colorObjectToCss: {
        type: 'value',
        transitive: true,
        matcher: (token) => token.$type === 'color' || token.type === 'color',
        transform: (token) => {
          const val = token.$value ?? token.value
          if (typeof val === 'string') return val
          if (val.colorSpace === 'oklch' && typeof val === 'object' && val !== null) {
            return `oklch(${val.components.join(' ')})`
          }
          return val.hex ?? val
        }
      }
    }
  },
  platforms: {
    css: {
      transforms: ['attribute/cti', 'name/kebab', 'colorObjectToCss'],
      buildPath: 'build/css/',
      files: [
        {
          destination: '_variables.css',
          format: 'css/variables'
        }
      ]
    }
  }
}
