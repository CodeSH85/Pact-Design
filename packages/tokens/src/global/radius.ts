import { px, rem, scale } from '../factory.ts'

export const globalRadius = {
  '00': px(0),
  ...scale(
    {
      '01': 0.125,
      '02': 0.1875,
      '03': 0.25,
      '04': 0.375,
      '05': 0.5,
      '06': 0.75,
      '07': 1,
      full: 999
    },
    rem
  )
} as const
