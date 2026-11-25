import { colorMap, colorRef, controlGeometry, shadowMap } from './helpers.ts'

export const fieldTokens = {
  ...controlGeometry(),
  bg: colorMap({
    $root: 'pd.system.color.surface.layer-1.$root',
    disabled: 'pd.system.color.surface.disabled'
  }),
  border: {
    $root: colorRef('pd.system.color.border.$root'),
    hover: colorRef('pd.system.color.border.strong'),
    focus: colorRef('pd.system.color.border.focus.$root'),
    invalid: colorMap({
      $root: 'pd.system.color.danger.border.strong',
      hover: 'pd.system.color.danger.text.hover',
      focus: 'pd.system.color.border.focus.danger'
    }),
    disabled: colorRef('pd.system.color.border.subtle')
  },
  shadow: shadowMap({
    focus: 'pd.system.elevation.focus.$root',
    'invalid-focus': 'pd.system.elevation.focus.danger'
  }),
  text: colorMap({
    $root: 'pd.system.color.on-surface.$root',
    placeholder: 'pd.system.color.on-surface.muted',
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
    text: colorRef('pd.system.color.danger.text.$root')
  }
} as const
