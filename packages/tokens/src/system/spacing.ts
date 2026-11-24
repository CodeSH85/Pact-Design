import { refMap } from '../factory.ts'
import type { GlobalRefPath } from '../global/index.ts'

export const systemSpacing = refMap('dimension', {
  none: 'pd.global.spacing.00',
  '3xs': 'pd.global.spacing.01',
  '2xs': 'pd.global.spacing.02',
  xs: 'pd.global.spacing.03',
  sm: 'pd.global.spacing.04',
  md: 'pd.global.spacing.05',
  lg: 'pd.global.spacing.06',
  xl: 'pd.global.spacing.07',
  '2xl': 'pd.global.spacing.08',
  '3xl': 'pd.global.spacing.09',
  '4xl': 'pd.global.spacing.10',
  '5xl': 'pd.global.spacing.12'
} as const satisfies Record<string, GlobalRefPath<'dimension'>>)
