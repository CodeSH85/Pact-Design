import { componentUno } from '../dsl/index.ts'
import { colorMap, dim, shadowRef, zIndexRef } from './helpers.ts'

export const popoverTokens = {
  popover: {
    surface: {
      'min-width': componentUno.minWidth(dim('global.size.14')),
      padding: componentUno.spacing(dim('system.spacing.xs')),
      radius: componentUno.radius(dim('system.radius.md')),
      offset: componentUno.spacing(dim('system.spacing.sm')),
      color: componentUno.color(colorMap({
        bg: 'system.background.elevated',
        text: 'system.on-surface.default',
        border: 'system.border.default'
      })),
      shadow: componentUno.shadow(shadowRef('system.elevation.lg')),
      'z-index': componentUno.zIndex(zIndexRef('system.z-index.popover'))
    },
    listbox: {
      'max-height': componentUno.maxHeight(dim('global.size.15')),
      padding: componentUno.spacing(dim('system.spacing.2xs')),
      gap: componentUno.spacing(dim('system.spacing.3xs'))
    },
    item: {
      height: componentUno.height(dim('system.control.height.sm')),
      'padding-x': componentUno.spacing(dim('system.spacing.sm')),
      gap: componentUno.spacing(dim('system.spacing.md')),
      radius: componentUno.radius(dim('system.radius.xs')),
      color: componentUno.color(colorMap({
        text: 'system.on-surface.default',
        'text-disabled': 'system.on-surface.disabled',
        'text-danger': 'system.semantic.on-danger-subtle',
        'bg-hover': 'system.background.layer-2-hover',
        'bg-selected': 'system.background.layer-2-hover',
        'bg-danger-hover': 'system.semantic.danger-subtle'
      }))
    },
    separator: {
      height: componentUno.height(dim('global.border.width.01')),
      'margin-y': componentUno.spacing(dim('system.spacing.2xs')),
      color: componentUno.color(colorMap({
        border: 'system.border.subtle'
      }))
    }
  }
} as const
