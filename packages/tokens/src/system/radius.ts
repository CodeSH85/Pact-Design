import { refMap } from '../factory.ts'
import type { GlobalRefPath } from '../global/index.ts'

export const systemRadius = refMap('dimension', {
  none: 'pd.global.radius.00',
  '2xs': 'pd.global.radius.01',
  xs: 'pd.global.radius.02',
  sm: 'pd.global.radius.03',
  md: 'pd.global.radius.04',
  lg: 'pd.global.radius.05',
  xl: 'pd.global.radius.06',
  '2xl': 'pd.global.radius.07',
  full: 'pd.global.radius.full'
} as const satisfies Record<string, GlobalRefPath<'dimension'>>)
