import { componentUno } from '../dsl/index.ts'
import { colorMap, dim, dimMap, shadowRef, zIndexRef } from './helpers.ts'

export const modalTokens = {
  modal: {
    overlay: {
      padding: componentUno.spacing(dim('system.spacing.md')),
      color: componentUno.color(colorMap({
        bg: 'system.background.backdrop'
      })),
      'z-index': componentUno.zIndex(zIndexRef('system.z-index.modal'))
    },
    content: {
      'max-width': componentUno.maxWidth(dimMap({
        sm: 'global.size.16',
        md: 'global.size.17',
        lg: 'global.size.18',
        xl: 'global.size.19'
      })),
      padding: componentUno.spacing(dim('system.spacing.lg')),
      gap: componentUno.spacing(dim('system.spacing.md')),
      radius: componentUno.radius(dim('system.radius.md')),
      color: componentUno.color(colorMap({
        bg: 'system.background.elevated',
        text: 'system.on-surface.default',
        border: 'system.border.default'
      })),
      shadow: componentUno.shadow(shadowRef('system.elevation.xl'))
    },
    header: {
      gap: componentUno.spacing(dim('system.spacing.md')),
      'padding-bottom': componentUno.spacing(dim('system.spacing.xs')),
      color: componentUno.color(colorMap({
        border: 'system.border.subtle'
      }))
    },
    footer: {
      gap: componentUno.spacing(dim('system.spacing.sm')),
      'padding-top': componentUno.spacing(dim('system.spacing.xs')),
      color: componentUno.color(colorMap({
        border: 'system.border.subtle'
      }))
    }
  }
} as const
