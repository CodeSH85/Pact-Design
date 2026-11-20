import { px, rem, scale } from '../dsl/index.ts'

export const globalSpacing = {
  spacing: {
    '00': px(0),
    ...scale(
      {
        '01': 0.0625,
        '02': 0.125,
        '03': 0.25,
        '04': 0.375,
        '05': 0.5,
        '06': 0.75,
        '07': 1,
        '08': 1.25,
        '09': 1.5,
        '10': 2,
        '11': 2.5,
        '12': 3,
        '13': 4
      },
      rem
    )
  }
} as const
