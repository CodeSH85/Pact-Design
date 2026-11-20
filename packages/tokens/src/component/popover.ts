import { colorMap, dim, shadowRef, zIndexRef } from './helpers.ts'

export const popoverTokens = {
  popover: {
    surface: {
      'min-width': dim('global.size.14'),
      padding: dim('system.spacing.xs'),
      radius: dim('system.radius.md'),
      offset: dim('system.spacing.sm'),
      color: colorMap({
        bg: 'system.background.elevated',
        text: 'system.on-surface.default',
        border: 'system.border.default'
      }),
      shadow: shadowRef('system.elevation.lg'),
      'z-index': zIndexRef('system.z-index.popover')
    },
    listbox: {
      'max-height': dim('global.size.15'),
      padding: dim('system.spacing.2xs'),
      gap: dim('system.spacing.3xs')
    },
    item: {
      height: dim('system.control.height.sm'),
      'padding-x': dim('system.spacing.sm'),
      gap: dim('system.spacing.md'),
      radius: dim('system.radius.xs'),
      color: colorMap({
        text: 'system.on-surface.default',
        'text-disabled': 'system.on-surface.disabled',
        'text-danger': 'system.semantic.on-danger-subtle',
        'bg-hover': 'system.background.layer-2-hover',
        'bg-selected': 'system.background.layer-2-hover',
        'bg-danger-hover': 'system.semantic.danger-subtle'
      })
    },
    separator: {
      height: dim('global.border.width.01'),
      'margin-y': dim('system.spacing.2xs'),
      color: colorMap({
        border: 'system.border.subtle'
      })
    }
  }
} as const
