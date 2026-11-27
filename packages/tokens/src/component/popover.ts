import { colorMap, colorRef, dim, shadowRef, zIndexRef } from './helpers.ts'

export const popoverTokens = {
  surface: {
    'min-width': dim('pd.global.size.14'),
    padding: dim('pd.system.spacing.xs'),
    radius: dim('pd.system.radius.md'),
    offset: dim('pd.system.spacing.sm'),
    bg: colorRef('pd.system.color.surface.elevated'),
    text: colorRef('pd.system.color.on-surface.$root'),
    border: colorRef('pd.system.color.border.$root'),
    shadow: shadowRef('pd.system.elevation.lg'),
    'z-index': zIndexRef('pd.system.elevation.z.popover')
  },
  listbox: {
    'max-height': dim('pd.global.size.15'),
    padding: dim('pd.system.spacing.2xs'),
    gap: dim('pd.system.spacing.3xs')
  },
  item: {
    height: dim('pd.system.size.control.sm'),
    'padding-x': dim('pd.system.spacing.sm'),
    gap: dim('pd.system.spacing.md'),
    radius: dim('pd.system.radius.xs'),
    text: colorMap({
      $root: 'pd.system.color.on-surface.$root',
      disabled: 'pd.system.color.on-surface.disabled',
      danger: 'pd.system.color.on-danger.subtle'
    }),
    bg: colorMap({
      hover: 'pd.system.color.surface.layer-2.hover',
      focus: 'pd.system.color.surface.layer-2.hover',
      selected: 'pd.system.color.surface.layer-2.hover',
      'danger-hover': 'pd.system.color.danger.subtle'
    }),
    icon: colorMap({
      selected: 'pd.system.color.primary.text.$root'
    })
  },
  separator: {
    height: dim('pd.global.border.width.01'),
    'margin-y': dim('pd.system.spacing.2xs'),
    border: colorRef('pd.system.color.border.subtle')
  }
} as const
