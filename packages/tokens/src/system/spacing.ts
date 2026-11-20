import { refMap, withUno } from '../dsl/index.ts'
import type { GlobalRefPath } from '../global/index.ts'

export const systemSpacing = {
  spacing: withUno(
    { slots: ['spacing'], keyFrom: 'category' },
    refMap('dimension', {
      none: 'global.spacing.00',
      '3xs': 'global.spacing.01',
      '2xs': 'global.spacing.02',
      xs: 'global.spacing.03',
      sm: 'global.spacing.04',
      md: 'global.spacing.05',
      lg: 'global.spacing.06',
      xl: 'global.spacing.07',
      '2xl': 'global.spacing.08',
      '3xl': 'global.spacing.09',
      '4xl': 'global.spacing.10',
      '5xl': 'global.spacing.12'
    } as const satisfies Record<string, GlobalRefPath<'dimension'>>)
  )
} as const
