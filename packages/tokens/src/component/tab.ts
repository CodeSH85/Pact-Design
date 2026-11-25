import { colorMap, colorRef, dim, dimMap, shadowRef } from './helpers.ts'

export const tabTokens = {
  list: {
    underline: {
      gap: dim('pd.system.spacing.md'),
      border: colorRef('pd.system.color.border.subtle')
    },
    segmented: {
      padding: dim('pd.system.spacing.3xs'),
      gap: dim('pd.system.spacing.2xs'),
      radius: dim('pd.system.radius.sm'),
      bg: colorRef('pd.system.color.surface.layer-2.$root'),
      border: colorRef('pd.system.color.border.subtle')
    },
    pill: {
      gap: dim('pd.system.spacing.xs')
    }
  },
  trigger: {
    height: dimMap({
      sm: 'pd.system.size.control.sm',
      md: 'pd.system.size.control.md',
      lg: 'pd.system.size.control.lg'
    }),
    'padding-x': dimMap({
      sm: 'pd.system.spacing.sm',
      md: 'pd.system.spacing.md',
      lg: 'pd.system.spacing.lg'
    }),
    gap: dimMap({
      sm: 'pd.system.spacing.xs',
      md: 'pd.system.spacing.xs',
      lg: 'pd.system.spacing.sm'
    }),
    text: colorMap({
      $root: 'pd.system.color.on-surface.muted',
      hover: 'pd.system.color.on-surface.$root',
      selected: 'pd.system.color.on-surface.$root',
      disabled: 'pd.system.color.on-surface.disabled'
    }),
    border: colorMap({
      selected: 'pd.system.color.primary.border.strong',
      focus: 'pd.system.color.border.focus.$root'
    }),
    segmented: {
      bg: colorMap({
        selected: 'pd.system.color.surface.layer-1.$root'
      }),
      shadow: {
        selected: shadowRef('pd.system.elevation.sm')
      }
    },
    pill: {
      bg: colorMap({
        hover: 'pd.system.color.surface.hover',
        selected: 'pd.system.color.primary.$root'
      }),
      text: colorMap({
        selected: 'pd.system.color.on-primary.$root'
      })
    }
  },
  panel: {
    'padding-top': dim('pd.system.spacing.md'),
    text: colorRef('pd.system.color.on-surface.$root')
  }
} as const
