import { colorMap, dim } from './helpers.ts'

export const checkboxTokens = {
  checkbox: {
    size: dim('system.icon.size.md'),
    'icon-size': dim('system.icon.size.xs'),
    radius: dim('system.radius.2xs'),
    color: colorMap({
      bg: 'system.background.layer-1',
      border: 'system.border.strong',
      'border-hover': 'system.semantic.primary',
      'bg-selected': 'system.semantic.primary',
      'border-selected': 'system.semantic.primary',
      'bg-disabled': 'system.background.disabled',
      'border-disabled': 'system.border.subtle',
      icon: 'system.semantic.on-primary',
      'icon-disabled': 'system.on-surface.disabled'
    })
  }
} as const
