import { colorMap, dim, shadowRef, zIndexRef } from './helpers.ts'

type ToastSemanticTone = 'info' | 'success' | 'warning' | 'danger'

function semanticTone(tone: ToastSemanticTone) {
  return colorMap({
    bg: `pd.system.color.${tone}.subtle.$root`,
    border: `pd.system.color.${tone}.border.$root`,
    text: `pd.system.color.on-${tone}.subtle`,
    icon: `pd.system.color.${tone}.text.$root`
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
      text: 'pd.system.color.on-surface.$root',
      icon: 'pd.system.color.on-surface.muted'
    }),
    info: semanticTone('info'),
    success: semanticTone('success'),
    warning: semanticTone('warning'),
    danger: semanticTone('danger')
  }
} as const
