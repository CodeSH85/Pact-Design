import { refMap } from '../factory.ts'
import type { GlobalRefPath } from '../global/index.ts'

const dimMap = <K extends string>(entries: Record<K, GlobalRefPath<'dimension'>>) =>
  refMap('dimension', entries)

export const systemSize = {
  ...dimMap({
    '3xs': 'pd.global.size.01',
    '2xs': 'pd.global.size.02',
    xs: 'pd.global.size.04',
    sm: 'pd.global.size.05',
    md: 'pd.global.size.06',
    lg: 'pd.global.size.08',
    xl: 'pd.global.size.09',
    '2xl': 'pd.global.size.10',
    '3xl': 'pd.global.size.11',
    '4xl': 'pd.global.size.12',
    '5xl': 'pd.global.size.13'
  }),
  control: dimMap({
    xs: 'pd.global.size.06',
    sm: 'pd.global.size.07',
    md: 'pd.global.size.08',
    lg: 'pd.global.size.09',
    xl: 'pd.global.size.10'
  }),
  icon: dimMap({
    xs: 'pd.global.size.03',
    sm: 'pd.global.size.04',
    md: 'pd.global.size.05',
    lg: 'pd.global.size.06',
    xl: 'pd.global.size.08'
  })
} as const
