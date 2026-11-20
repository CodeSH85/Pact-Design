import { colorMap, dim } from './helpers.ts'

export const disclosureTokens = {
  disclosure: {
    container: {
      radius: dim('system.radius.sm'),
      gap: dim('system.spacing.xs'),
      color: colorMap({
        bg: 'system.background.layer-1',
        border: 'system.border.default',
        divider: 'system.border.subtle'
      })
    },
    trigger: {
      height: dim('system.control.height.md'),
      'padding-x': dim('system.spacing.md'),
      radius: dim('system.radius.xs'),
      color: colorMap({
        text: 'system.on-surface.default',
        'text-disabled': 'system.on-surface.disabled',
        'bg-hover': 'system.background.hover',
        'bg-active': 'system.background.active'
      })
    },
    panel: {
      'padding-x': dim('system.spacing.md'),
      'padding-y': dim('system.spacing.sm'),
      color: colorMap({
        text: 'system.on-surface.secondary'
      })
    }
  }
} as const
