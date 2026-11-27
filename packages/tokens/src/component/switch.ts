import { colorMap, dim, dimMap, shadowRef } from './helpers.ts'

export const switchTokens = {
  track: {
    width: dimMap({
      sm: 'pd.global.size.07',
      md: 'pd.global.size.09'
    }),
    height: dimMap({
      sm: 'pd.global.size.04',
      md: 'pd.global.size.05'
    }),
    padding: dim('pd.system.spacing.2xs'),
    radius: dim('pd.system.radius.full'),
    bg: colorMap({
      unchecked: 'pd.system.color.surface.layer-1.active',
      checked: 'pd.system.color.primary.border.strong',
      disabled: 'pd.system.color.surface.disabled'
    }),
    border: colorMap({
      unchecked: 'pd.system.color.border.$root',
      checked: 'pd.system.color.primary.border.strong',
      focus: 'pd.system.color.border.focus.$root',
      disabled: 'pd.system.color.border.subtle'
    })
  },
  thumb: {
    size: dimMap({
      sm: 'pd.global.size.03',
      md: 'pd.global.size.04'
    }),
    translate: dimMap({
      sm: 'pd.global.size.03',
      md: 'pd.global.size.04'
    }),
    radius: dim('pd.system.radius.full'),
    bg: colorMap({
      $root: 'pd.system.color.on-primary.$root',
      checked: 'pd.system.color.surface.layer-1.$root'
    }),
    shadow: shadowRef('pd.system.elevation.xs')
  }
} as const
