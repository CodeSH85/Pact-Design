import { componentUno } from '../dsl/index.ts'
import { colorMap, controlGeometry } from './helpers.ts'

export const buttonTokens = {
  button: {
    ...controlGeometry(),
    color: componentUno.color({
      primary: colorMap({
        bg: 'system.semantic.primary',
        'bg-hover': 'system.semantic.primary-hover',
        'bg-active': 'system.semantic.primary-active',
        text: 'system.semantic.on-primary',
        border: 'transparent'
      }),
      secondary: colorMap({
        bg: 'system.background.layer-1',
        'bg-hover': 'system.background.layer-1-hover',
        'bg-active': 'system.background.layer-1-active',
        'bg-selected': 'system.background.layer-1-selected',
        text: 'system.on-surface.default',
        'text-selected': 'system.on-surface.default',
        border: 'system.border.default',
        'border-selected': 'system.border.strong'
      }),
      ghost: colorMap({
        bg: 'transparent',
        'bg-hover': 'system.background.hover',
        'bg-active': 'system.background.active',
        'bg-selected': 'system.background.layer-1-selected',
        text: 'system.on-surface.default',
        'text-selected': 'system.on-surface.default',
        border: 'transparent'
      }),
      danger: colorMap({
        bg: 'system.semantic.danger',
        'bg-hover': 'system.semantic.danger-hover',
        'bg-active': 'system.semantic.danger-active',
        text: 'system.semantic.on-danger',
        border: 'transparent'
      }),
      subtle: colorMap({
        bg: 'system.semantic.info-subtle',
        'bg-hover': 'system.background.layer-2-hover',
        'bg-active': 'system.background.layer-2-active',
        text: 'system.semantic.on-info-subtle',
        border: 'system.semantic.info-border'
      }),
      disabled: colorMap({
        bg: 'system.background.disabled',
        text: 'system.on-surface.disabled',
        border: 'transparent'
      })
    })
  }
} as const
