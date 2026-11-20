import { internal, ref, refMap, shadow, themed, withUno } from '../dsl/index.ts'
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
    color: `{system.shadow.color.${level}}`
  })
}

const tShadowColor = (light: GlobalRefPath<'color'>, dark: GlobalRefPath<'color'>) =>
  themed(ref('color', light), ref('color', dark))

export const systemElevation = {
  elevation: withUno({ slots: ['boxShadow'], keyFrom: 'category', prefix: 'elevation-' }, {
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
  }),
  'z-index': withUno(
    { slots: ['zIndex'], keyFrom: 'category' },
    refMap('number', {
      base: 'global.z-index.00',
      docked: 'global.z-index.01',
      dropdown: 'global.z-index.02',
      sticky: 'global.z-index.03',
      drawer: 'global.z-index.04',
      modal: 'global.z-index.05',
      popover: 'global.z-index.06',
      toast: 'global.z-index.07'
    } as Record<string, GlobalRefPath<'number'>>)
  ),
  shadow: internal({
    color: {
      xs: tShadowColor('global.shadow.color.01', 'global.shadow.color.06'),
      sm: tShadowColor('global.shadow.color.02', 'global.shadow.color.07'),
      md: tShadowColor('global.shadow.color.03', 'global.shadow.color.08'),
      lg: tShadowColor('global.shadow.color.04', 'global.shadow.color.09'),
      xl: tShadowColor('global.shadow.color.05', 'global.shadow.color.10')
    }
  })
} as const
