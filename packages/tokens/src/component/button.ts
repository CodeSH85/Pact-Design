import { colorMap, colorRef, controlGeometry } from './helpers.ts'

export const buttonTokens = {
  ...controlGeometry(),
  primary: {
    bg: colorMap({
      $root: 'pd.system.color.primary.$root',
      hover: 'pd.system.color.primary.strong',
      active: 'pd.system.color.primary.stronger'
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
      $root: 'pd.system.color.fg.$root',
      selected: 'pd.system.color.fg.$root'
    }),
    border: colorMap({
      $root: 'pd.system.color.border.$root',
      selected: 'pd.system.color.border.strong'
    })
  },
  ghost: {
    bg: colorMap({
      $root: 'transparent',
      hover: 'pd.system.color.surface.layer-2.hover',
      active: 'pd.system.color.surface.layer-2.active',
      selected: 'pd.system.color.surface.layer-1.selected.$root'
    }),
    text: colorMap({
      $root: 'pd.system.color.fg.$root',
      selected: 'pd.system.color.fg.$root'
    }),
    border: colorRef('transparent')
  },
  danger: {
    bg: colorMap({
      $root: 'pd.system.color.danger.$root',
      hover: 'pd.system.color.danger.strong',
      active: 'pd.system.color.danger.stronger'
    }),
    text: colorRef('pd.system.color.on-danger.$root'),
    border: colorRef('transparent'),
    focus: colorRef('pd.system.color.border.focus.danger')
  },
  subtle: {
    bg: colorMap({
      $root: 'pd.system.color.info.subtle',
      hover: 'pd.system.color.info.muted',
      active: 'pd.system.color.info.soft'
    }),
    text: colorRef('pd.system.color.on-info.subtle'),
    border: colorRef('pd.system.color.info.border.$root')
  },
  link: {
    text: colorMap({
      $root: 'pd.system.color.primary.text.$root',
      hover: 'pd.system.color.primary.text.strong',
      active: 'pd.system.color.primary.text.stronger'
    })
  },
  disabled: {
    bg: colorRef('pd.system.color.surface.disabled'),
    text: colorRef('pd.system.color.fg.disabled'),
    border: colorRef('transparent')
  }
} as const
