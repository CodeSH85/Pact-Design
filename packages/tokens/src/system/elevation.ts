import { refMap, shadow } from '../factory.ts'
import type { GlobalRefPath } from '../global/index.ts'

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
    color: `{pd.system.color.shadow.${level}}`
  })
}

export const systemElevation = {
  xs: elevationShadow('xs', {
    offsetX: 'pd.global.elevation.offset.00',
    offsetY: 'pd.global.elevation.offset.01',
    blur: 'pd.global.elevation.blur.01',
    spread: 'pd.global.elevation.spread.00'
  }),
  sm: elevationShadow('sm', {
    offsetX: 'pd.global.elevation.offset.00',
    offsetY: 'pd.global.elevation.offset.02',
    blur: 'pd.global.elevation.blur.02',
    spread: 'pd.global.elevation.spread.00'
  }),
  md: elevationShadow('md', {
    offsetX: 'pd.global.elevation.offset.00',
    offsetY: 'pd.global.elevation.offset.03',
    blur: 'pd.global.elevation.blur.03',
    spread: 'pd.global.elevation.spread.01'
  }),
  lg: elevationShadow('lg', {
    offsetX: 'pd.global.elevation.offset.00',
    offsetY: 'pd.global.elevation.offset.04',
    blur: 'pd.global.elevation.blur.04',
    spread: 'pd.global.elevation.spread.02'
  }),
  xl: elevationShadow('xl', {
    offsetX: 'pd.global.elevation.offset.00',
    offsetY: 'pd.global.elevation.offset.05',
    blur: 'pd.global.elevation.blur.05',
    spread: 'pd.global.elevation.spread.03'
  }),
  z: refMap('number', {
    base: 'pd.global.elevation.z-index.00',
    docked: 'pd.global.elevation.z-index.01',
    dropdown: 'pd.global.elevation.z-index.02',
    sticky: 'pd.global.elevation.z-index.03',
    drawer: 'pd.global.elevation.z-index.04',
    modal: 'pd.global.elevation.z-index.05',
    popover: 'pd.global.elevation.z-index.06',
    toast: 'pd.global.elevation.z-index.07'
  } as const satisfies Record<string, GlobalRefPath<'number'>>)
} as const
