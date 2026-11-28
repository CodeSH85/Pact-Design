import { colorMap, colorRef, dim } from './helpers.ts'

export const disclosureTokens = {
  container: {
    radius: dim('pd.system.radius.sm'),
    gap: dim('pd.system.spacing.xs'),
    bg: colorRef('pd.system.color.surface.layer-1.$root'),
    border: colorRef('pd.system.color.border.$root'),
    divider: colorRef('pd.system.color.border.subtle')
  },
  trigger: {
    height: dim('pd.system.size.control.md'),
    'padding-x': dim('pd.system.spacing.md'),
    radius: dim('pd.system.radius.xs'),
    text: colorMap({
      $root: 'pd.system.color.fg.$root',
      disabled: 'pd.system.color.fg.disabled'
    }),
    bg: colorMap({
      hover: 'pd.system.color.surface.hover',
      active: 'pd.system.color.surface.active'
    })
  },
  panel: {
    'padding-x': dim('pd.system.spacing.md'),
    'padding-y': dim('pd.system.spacing.sm'),
    text: colorRef('pd.system.color.fg.muted')
  }
} as const
