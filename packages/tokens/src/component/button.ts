import { colorMap, colorRef, controlGeometry } from './helpers.ts'

export const buttonTokens = {
  ...controlGeometry(),
  primary: {
    bg: colorMap({
      $root: 'pd.system.color.primary.$root',
      hover: 'pd.system.color.primary.hover',
      active: 'pd.system.color.primary.active'
    }),
    text: colorRef('pd.system.color.on-primary.$root'),
    border: colorRef('transparent')
  },
  secondary: {
    bg: colorMap({
      $root: 'pd.system.color.surface.layer-1.$root',
      hover: 'pd.system.color.surface.layer-1.hover',
      active: 'pd.system.color.surface.layer-1.active',
      selected: 'pd.system.color.surface.layer-1.selected.$root'
    }),
    text: colorMap({
      $root: 'pd.system.color.on-surface.$root',
      selected: 'pd.system.color.on-surface.$root'
    }),
    border: colorMap({
      $root: 'pd.system.color.border.$root',
      selected: 'pd.system.color.border.strong'
    })
  },
  ghost: {
    bg: colorMap({
      $root: 'transparent',
      hover: 'pd.system.color.surface.hover',
      active: 'pd.system.color.surface.active',
      selected: 'pd.system.color.surface.layer-1.selected.$root'
    }),
    text: colorMap({
      $root: 'pd.system.color.on-surface.$root',
      selected: 'pd.system.color.on-surface.$root'
    }),
    border: colorRef('transparent')
  },
  danger: {
    bg: colorMap({
      $root: 'pd.system.color.danger.$root',
      hover: 'pd.system.color.danger.hover',
      active: 'pd.system.color.danger.active'
    }),
    text: colorRef('pd.system.color.on-danger.$root'),
    border: colorRef('transparent')
  },
  subtle: {
    bg: colorMap({
      $root: 'pd.system.color.info.subtle',
      hover: 'pd.system.color.surface.layer-2.hover',
      active: 'pd.system.color.surface.layer-2.active'
    }),
    text: colorRef('pd.system.color.on-info.subtle'),
    border: colorRef('pd.system.color.info.border')
  },
  disabled: {
    bg: colorRef('pd.system.color.surface.disabled'),
    text: colorRef('pd.system.color.on-surface.disabled'),
    border: colorRef('transparent')
  }
} as const
