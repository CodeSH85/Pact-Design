import { componentUno } from '../dsl/index.ts'
import { colorMap, dim, dimMap, shadowRef } from './helpers.ts'

export const switchTokens = {
  switch: {
    track: {
      width: componentUno.width(dimMap({
        sm: 'global.size.07',
        md: 'global.size.09'
      })),
      height: componentUno.height(dimMap({
        sm: 'global.size.04',
        md: 'global.size.05'
      })),
      padding: componentUno.spacing(dim('system.spacing.2xs')),
      radius: componentUno.radius(dim('system.radius.full')),
      color: componentUno.color(colorMap({
        'bg-unchecked': 'system.background.layer-1-active',
        'border-unchecked': 'system.border.default',
        'bg-checked': 'system.semantic.primary',
        'border-checked': 'system.semantic.primary',
        'bg-disabled': 'system.background.disabled',
        'border-disabled': 'system.border.subtle'
      }))
    },
    thumb: {
      size: componentUno.size(dimMap({
        sm: 'global.size.03',
        md: 'global.size.04'
      })),
      translate: componentUno.spacing(dimMap({
        sm: 'global.size.03',
        md: 'global.size.04'
      })),
      radius: componentUno.radius(dim('system.radius.full')),
      color: componentUno.color(colorMap({
        bg: 'system.background.layer-2'
      })),
      shadow: componentUno.shadow(shadowRef('system.elevation.xs'))
    }
  }
} as const
