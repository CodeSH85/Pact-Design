import { colorMap, dim, shadowRef, zIndexRef } from './helpers.ts'

type ToastSemanticTone = 'info' | 'success' | 'warning' | 'danger'

function semanticTone(tone: ToastSemanticTone) {
  return colorMap({
    bg: `pd.system.color.${tone}.subtle`,
    border: `pd.system.color.${tone}.border.$root`,
    text: `pd.system.color.on-${tone}.subtle`,
    icon: `pd.system.color.${tone}.text.$root`,
    'close-hover': `pd.system.color.${tone}.muted`
  })
}

export const toastTokens = {
  container: {
    'max-width': dim('pd.global.size.16'),
    padding: dim('pd.system.spacing.md'),
    gap: dim('pd.system.spacing.sm'),
    radius: dim('pd.system.radius.md'),
    shadow: shadowRef('pd.system.elevation.lg'),
    'z-index': zIndexRef('pd.system.elevation.z.toast')
  },
  tone: {
    default: colorMap({
      bg: 'pd.system.color.surface.elevated',
      border: 'pd.system.color.border.$root',
      text: 'pd.system.color.fg.$root',
      icon: 'pd.system.color.fg.subtle',
      'close-hover': 'pd.system.color.surface.layer-2.hover'
    }),
    info: semanticTone('info'),
    success: semanticTone('success'),
    warning: semanticTone('warning'),
    danger: semanticTone('danger')
  }
} as const
