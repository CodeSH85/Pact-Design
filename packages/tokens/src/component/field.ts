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
      hover: 'pd.system.color.danger.text.strong',
      focus: 'pd.system.color.border.focus.danger'
    }),
    disabled: colorRef('pd.system.color.border.subtle')
  },
  shadow: shadowMap({
    focus: 'pd.system.elevation.focus.$root',
    'invalid-focus': 'pd.system.elevation.focus.danger'
  }),
  text: colorMap({
    $root: 'pd.system.color.fg.$root',
    placeholder: 'pd.system.color.fg.subtle',
    disabled: 'pd.system.color.fg.disabled',
    muted: 'pd.system.color.fg.subtle'
  }),
  label: {
    text: colorRef('pd.system.color.fg.$root')
  },
  description: {
    text: colorRef('pd.system.color.fg.subtle')
  },
  error: {
    text: colorRef('pd.system.color.danger.text.$root')
  }
} as const
