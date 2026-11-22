import { px, rem, scale, strokeStyle } from '../dsl/index.ts'

export const globalBorder = {
  border: {
    width: scale(
      {
        '00': 0,
        '01': 1,
        '02': 2,
        '03': 3,
        '04': 4,
        '05': 5,
        '06': 6
      },
      px
    ),
    style: {
      solid: strokeStyle('solid'),
      dashed: strokeStyle('dashed'),
      inset: strokeStyle('inset'),
      outset: strokeStyle('outset')
    },
    offset: scale(
      {
        'inset-02': -2,
        'inset-01': -1,
        '00': 0,
        '01': 1,
        '02': 2
      },
      px
    )
  },
  radius: {
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
  }
} as const
