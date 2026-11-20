import { componentUno } from '../dsl/index.ts'
import { colorMap, dim, shadowRef, zIndexRef } from './helpers.ts'

type ToastSemanticTone = 'info' | 'success' | 'warning' | 'danger'

function semanticTone(tone: ToastSemanticTone) {
  return {
    color: componentUno.color(colorMap({
      bg: `system.semantic.${tone}-subtle`,
      border: `system.semantic.${tone}-border`,
      text: `system.semantic.on-${tone}-subtle`,
      icon: `system.semantic.${tone}`
    }))
  }
}

export const toastTokens = {
  toast: {
    container: {
      'max-width': componentUno.maxWidth(dim('global.size.16')),
      padding: componentUno.spacing(dim('system.spacing.md')),
      gap: componentUno.spacing(dim('system.spacing.sm')),
      radius: componentUno.radius(dim('system.radius.md')),
      shadow: componentUno.shadow(shadowRef('system.elevation.lg')),
      'z-index': componentUno.zIndex(zIndexRef('system.z-index.toast'))
    },
    tone: {
      default: {
        color: componentUno.color(colorMap({
          bg: 'system.background.elevated',
          border: 'system.border.default',
          text: 'system.on-surface.default',
          icon: 'system.on-surface.muted'
        }))
      },
      info: semanticTone('info'),
      success: semanticTone('success'),
      warning: semanticTone('warning'),
      danger: semanticTone('danger')
    }
  }
} as const
