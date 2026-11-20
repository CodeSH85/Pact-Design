import { internal, num, oklchPalette, rem, scale, withUno } from '../dsl/index.ts'

export const globalElevation = {
  offset: internal(scale({ '00': 0, '01': 0.0625, '02': 0.125, '03': 0.25, '04': 0.5, '05': 1 }, rem)),
  blur: internal(scale({ '01': 0.125, '02': 0.25, '03': 0.5, '04': 1, '05': 1.5, '06': 2 }, rem)),
  spread: internal(scale({ '00': 0, '01': -0.0625, '02': -0.125, '03': -0.25, '04': 0.0625, '05': 0.125 }, rem)),
  shadow: {
    color: withUno(
      { slots: ['colors'], keyFrom: 'scale-kebab' },
      oklchPalette({
        '01': [0, 0, 0, 0.06],
        '02': [0, 0, 0, 0.08],
        '03': [0, 0, 0, 0.1],
        '04': [0, 0, 0, 0.14],
        '05': [0, 0, 0, 0.18],
        '06': [0, 0, 0, 0.28],
        '07': [0, 0, 0, 0.36],
        '08': [0, 0, 0, 0.45],
        '09': [0, 0, 0, 0.56],
        '10': [0, 0, 0, 0.68]
      })
    )
  },
  'z-index': internal(
    scale({ '00': 0, '01': 10, '02': 100, '03': 200, '04': 300, '05': 400, '06': 500, '07': 600 }, num)
  )
} as const
