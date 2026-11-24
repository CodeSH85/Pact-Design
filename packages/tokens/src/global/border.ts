import { px, scale, strokeStyle } from '../factory.ts'

export const globalBorder = {
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
} as const
