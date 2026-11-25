import { colorMap, dim } from './helpers.ts'

export const checkboxTokens = {
  size: dim('pd.system.size.icon.md'),
  'icon-size': dim('pd.system.size.icon.xs'),
  radius: dim('pd.system.radius.2xs'),
  bg: colorMap({
    $root: 'pd.system.color.surface.layer-1.$root',
    selected: 'pd.system.color.primary.$root',
    disabled: 'pd.system.color.surface.disabled'
  }),
  border: colorMap({
    $root: 'pd.system.color.border.strong',
    hover: 'pd.system.color.primary.border.strong',
    focus: 'pd.system.color.border.focus.$root',
    selected: 'pd.system.color.primary.$root',
    disabled: 'pd.system.color.border.subtle'
  }),
  icon: colorMap({
    $root: 'pd.system.color.on-primary.$root',
    disabled: 'pd.system.color.on-surface.disabled'
  })
} as const
