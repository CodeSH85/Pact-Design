import { refMap, withUno } from '../dsl/index.ts'
import type { GlobalRefPath } from '../global/index.ts'

const dimMap = <K extends string>(entries: Record<K, GlobalRefPath<'dimension'>>) =>
  refMap('dimension', entries)

export const systemSizing = {
  size: withUno(
    [
      { slots: ['width', 'height'], keyFrom: 'category' },
      { slots: ['width', 'height'], keyFrom: 'category', prefix: 'size-' }
    ],
    dimMap({
      '3xs': 'global.size.01',
      '2xs': 'global.size.02',
      xs: 'global.size.04',
      sm: 'global.size.05',
      md: 'global.size.06',
      lg: 'global.size.08',
      xl: 'global.size.09',
      '2xl': 'global.size.10',
      '3xl': 'global.size.11',
      '4xl': 'global.size.12',
      '5xl': 'global.size.13'
    })
  ),
  control: {
    height: withUno(
      { slots: ['spacing', 'height', 'minHeight', 'width'], keyFrom: 'category-sub', prefix: 'control-' },
      dimMap({
        xs: 'global.size.06',
        sm: 'global.size.07',
        md: 'global.size.08',
        lg: 'global.size.09',
        xl: 'global.size.10'
      })
    )
  },
  icon: {
    size: withUno(
      { slots: ['spacing', 'width', 'height'], keyFrom: 'category-sub', prefix: 'icon-' },
      dimMap({
        xs: 'global.size.03',
        sm: 'global.size.04',
        md: 'global.size.05',
        lg: 'global.size.06',
        xl: 'global.size.08'
      })
    )
  }
} as const
