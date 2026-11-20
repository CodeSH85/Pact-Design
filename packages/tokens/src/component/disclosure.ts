import { componentUno } from '../dsl/index.ts'
import { colorMap, dim } from './helpers.ts'

export const disclosureTokens = {
  disclosure: {
    container: {
      radius: componentUno.radius(dim('system.radius.sm')),
      gap: componentUno.spacing(dim('system.spacing.xs')),
      color: componentUno.color(colorMap({
        bg: 'system.background.layer-1',
        border: 'system.border.default',
        divider: 'system.border.subtle'
      }))
    },
    trigger: {
      height: componentUno.height(dim('system.control.height.md')),
      'padding-x': componentUno.spacing(dim('system.spacing.md')),
      radius: componentUno.radius(dim('system.radius.xs')),
      color: componentUno.color(colorMap({
        text: 'system.on-surface.default',
        'text-disabled': 'system.on-surface.disabled',
        'bg-hover': 'system.background.hover',
        'bg-active': 'system.background.active'
      }))
    },
    panel: {
      'padding-x': componentUno.spacing(dim('system.spacing.md')),
      'padding-y': componentUno.spacing(dim('system.spacing.sm')),
      color: componentUno.color(colorMap({
        text: 'system.on-surface.secondary'
      }))
    }
  }
} as const
