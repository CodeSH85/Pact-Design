import { colorMap, dim, dimMap, shadowRef, zIndexRef } from './helpers.ts'

export const modalTokens = {
  modal: {
    overlay: {
      padding: dim('system.spacing.md'),
      color: colorMap({
        bg: 'system.background.backdrop'
      }),
      'z-index': zIndexRef('system.z-index.modal')
    },
    content: {
      'max-width': dimMap({
        sm: 'global.size.16',
        md: 'global.size.17',
        lg: 'global.size.18',
        xl: 'global.size.19'
      }),
      padding: dim('system.spacing.lg'),
      gap: dim('system.spacing.md'),
      radius: dim('system.radius.md'),
      color: colorMap({
        bg: 'system.background.elevated',
        text: 'system.on-surface.default',
        border: 'system.border.default'
      }),
      shadow: shadowRef('system.elevation.xl')
    },
    header: {
      gap: dim('system.spacing.md'),
      'padding-bottom': dim('system.spacing.xs'),
      color: colorMap({
        border: 'system.border.subtle'
      })
    },
    footer: {
      gap: dim('system.spacing.sm'),
      'padding-top': dim('system.spacing.xs'),
      color: colorMap({
        border: 'system.border.subtle'
      })
    }
  }
} as const
