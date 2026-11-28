import { colorRef, dim, dimMap, shadowRef, zIndexRef } from './helpers.ts'

export const modalTokens = {
  overlay: {
    padding: dim('pd.system.spacing.md'),
    bg: colorRef('pd.system.color.surface.backdrop'),
    'z-index': zIndexRef('pd.system.elevation.z.modal')
  },
  content: {
    'max-width': dimMap({
      sm: 'pd.global.size.16',
      md: 'pd.global.size.17',
      lg: 'pd.global.size.18',
      xl: 'pd.global.size.19'
    }),
    padding: dim('pd.system.spacing.lg'),
    gap: dim('pd.system.spacing.md'),
    radius: dim('pd.system.radius.md'),
    bg: colorRef('pd.system.color.surface.elevated'),
    text: colorRef('pd.system.color.fg.$root'),
    border: colorRef('pd.system.color.border.$root'),
    shadow: shadowRef('pd.system.elevation.xl')
  },
  header: {
    gap: dim('pd.system.spacing.md'),
    'padding-bottom': dim('pd.system.spacing.xs'),
    border: colorRef('pd.system.color.border.subtle')
  },
  footer: {
    gap: dim('pd.system.spacing.sm'),
    'padding-top': dim('pd.system.spacing.xs'),
    border: colorRef('pd.system.color.border.subtle')
  }
} as const
