import { refMap, shadow } from '../dsl/index.ts'
import type { GlobalRefPath } from '../global/index.ts'
import { color } from './color.ts'

type ElevationLevel = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

function elevationShadow(
  level: ElevationLevel,
  cfg: {
    offsetX: GlobalRefPath<'dimension'>
    offsetY: GlobalRefPath<'dimension'>
    blur: GlobalRefPath<'dimension'>
    spread: GlobalRefPath<'dimension'>
  }
) {
  return shadow({
    offsetX: `{${cfg.offsetX}}`,
    offsetY: `{${cfg.offsetY}}`,
    blur: `{${cfg.blur}}`,
    spread: `{${cfg.spread}}`,
    color: `{system.shadow.color.${level}}`
  })
}

export const systemElevation = {
  elevation: {
    xs: elevationShadow('xs', {
      offsetX: 'global.offset.00',
      offsetY: 'global.offset.01',
      blur: 'global.blur.01',
      spread: 'global.spread.00'
    }),
    sm: elevationShadow('sm', {
      offsetX: 'global.offset.00',
      offsetY: 'global.offset.02',
      blur: 'global.blur.02',
      spread: 'global.spread.00'
    }),
    md: elevationShadow('md', {
      offsetX: 'global.offset.00',
      offsetY: 'global.offset.03',
      blur: 'global.blur.03',
      spread: 'global.spread.01'
    }),
    lg: elevationShadow('lg', {
      offsetX: 'global.offset.00',
      offsetY: 'global.offset.04',
      blur: 'global.blur.04',
      spread: 'global.spread.02'
    }),
    xl: elevationShadow('xl', {
      offsetX: 'global.offset.00',
      offsetY: 'global.offset.05',
      blur: 'global.blur.05',
      spread: 'global.spread.03'
    })
  },
  'z-index': refMap('number', {
    base: 'global.z-index.00',
    docked: 'global.z-index.01',
    dropdown: 'global.z-index.02',
    sticky: 'global.z-index.03',
    drawer: 'global.z-index.04',
    modal: 'global.z-index.05',
    popover: 'global.z-index.06',
    toast: 'global.z-index.07'
  } as Record<string, GlobalRefPath<'number'>>),
  shadow: {
    color: {
      xs: color({ light: 'shadow.color.01', dark: 'shadow.color.06' }),
      sm: color({ light: 'shadow.color.02', dark: 'shadow.color.07' }),
      md: color({ light: 'shadow.color.03', dark: 'shadow.color.08' }),
      lg: color({ light: 'shadow.color.04', dark: 'shadow.color.09' }),
      xl: color({ light: 'shadow.color.05', dark: 'shadow.color.10' })
    }
  }
} as const
