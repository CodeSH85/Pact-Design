import { componentUno } from '../dsl/index.ts'
import { colorMap, dim } from './helpers.ts'

export const radioTokens = {
  radio: {
    size: componentUno.size(dim('system.icon.size.md')),
    dot: {
      size: componentUno.size(dim('global.size.02'))
    },
    radius: componentUno.radius(dim('system.radius.full')),
    color: componentUno.color(colorMap({
      bg: 'system.background.layer-1',
      border: 'system.border.strong',
      'border-hover': 'system.semantic.primary',
      'bg-selected': 'system.semantic.primary',
      'border-selected': 'system.semantic.primary',
      'bg-disabled': 'system.background.disabled',
      'border-disabled': 'system.border.subtle',
      dot: 'system.semantic.on-primary',
      'dot-disabled': 'system.on-surface.disabled'
    }))
  }
} as const
