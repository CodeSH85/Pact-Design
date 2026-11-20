import { componentUno } from '../dsl/index.ts'
import { colorMap, controlGeometry } from './helpers.ts'

export const fieldTokens = {
  field: {
    ...controlGeometry(),
    color: componentUno.color({
      bg: colorMap({
        default: 'system.background.layer-1',
        disabled: 'system.background.disabled'
      }),
      border: colorMap({
        default: 'system.border.default',
        hover: 'system.border.strong',
        focus: 'system.border.focus',
        invalid: 'system.semantic.danger',
        'invalid-hover': 'system.semantic.danger-hover',
        disabled: 'system.border.subtle'
      }),
      text: colorMap({
        default: 'system.on-surface.default',
        placeholder: 'system.on-surface.disabled',
        disabled: 'system.on-surface.disabled',
        muted: 'system.on-surface.muted'
      }),
      label: colorMap({
        text: 'system.on-surface.default'
      }),
      description: colorMap({
        text: 'system.on-surface.muted'
      }),
      error: colorMap({
        text: 'system.semantic.on-danger-subtle'
      })
    })
  }
} as const
