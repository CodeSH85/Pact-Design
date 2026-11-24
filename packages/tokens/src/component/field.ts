import { colorMap, colorRef, controlGeometry } from './helpers.ts'

export const fieldTokens = {
  ...controlGeometry(),
  bg: colorMap({
    $root: 'pd.system.color.surface.layer-1.$root',
    disabled: 'pd.system.color.surface.disabled'
  }),
  border: {
    $root: colorRef('pd.system.color.border.$root'),
    hover: colorRef('pd.system.color.border.strong'),
    focus: colorRef('pd.system.color.border.focus'),
    invalid: colorMap({
      $root: 'pd.system.color.danger.$root',
      hover: 'pd.system.color.danger.hover'
    }),
    disabled: colorRef('pd.system.color.border.subtle')
  },
  text: colorMap({
    $root: 'pd.system.color.on-surface.$root',
    placeholder: 'pd.system.color.on-surface.disabled',
    disabled: 'pd.system.color.on-surface.disabled',
    muted: 'pd.system.color.on-surface.muted'
  }),
  label: {
    text: colorRef('pd.system.color.on-surface.$root')
  },
  description: {
    text: colorRef('pd.system.color.on-surface.muted')
  },
  error: {
    text: colorRef('pd.system.color.on-danger.subtle')
  }
} as const
