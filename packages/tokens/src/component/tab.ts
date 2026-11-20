import { colorMap, dim, dimMap, shadowRef } from './helpers.ts'

export const tabTokens = {
  tab: {
    list: {
      underline: {
        gap: dim('system.spacing.md'),
        color: colorMap({
          border: 'system.border.subtle'
        })
      },
      segmented: {
        padding: dim('system.spacing.3xs'),
        gap: dim('system.spacing.2xs'),
        radius: dim('system.radius.sm'),
        color: colorMap({
          bg: 'system.background.layer-2',
          border: 'system.border.subtle'
        })
      },
      pill: {
        gap: dim('system.spacing.xs')
      }
    },
    trigger: {
      height: dimMap({
        sm: 'system.control.height.sm',
        md: 'system.control.height.md',
        lg: 'system.control.height.lg'
      }),
      'padding-x': dimMap({
        sm: 'system.spacing.sm',
        md: 'system.spacing.md',
        lg: 'system.spacing.lg'
      }),
      gap: dimMap({
        sm: 'system.spacing.xs',
        md: 'system.spacing.xs',
        lg: 'system.spacing.sm'
      }),
      color: colorMap({
        text: 'system.on-surface.muted',
        'text-hover': 'system.on-surface.default',
        'text-selected': 'system.on-surface.default',
        'text-disabled': 'system.on-surface.disabled',
        'border-selected': 'system.semantic.primary',
        'segmented-bg-selected': 'system.background.layer-1',
        'pill-bg-hover': 'system.background.hover',
        'pill-bg-selected': 'system.semantic.primary',
        'pill-text-selected': 'system.semantic.on-primary'
      }),
      shadow: {
        'segmented-selected': shadowRef('system.elevation.sm')
      }
    },
    panel: {
      'padding-top': dim('system.spacing.md'),
      color: colorMap({
        text: 'system.on-surface.default'
      })
    }
  }
} as const
