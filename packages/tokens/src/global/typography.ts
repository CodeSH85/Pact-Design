import { fontFamily, fontWeight, num, rem, scale, withUno } from '../dsl/index.ts'

export const globalTypography = {
  font: {
    family: withUno({ slots: ['fontFamily'], keyFrom: 'category-sub' }, {
      sans: fontFamily(
        'Inter',
        'PingFang SC',
        'Microsoft YaHei',
        'Noto Sans CJK SC',
        'ui-sans-serif',
        'system-ui',
        'sans-serif'
      ),
      mono: fontFamily('SFMono-Regular', 'Menlo', 'Consolas', 'ui-monospace', 'system-ui')
    }),
    size: withUno(
      { slots: ['fontSize'], keyFrom: 'category-sub', prefix: 'size-' },
      scale(
        {
          '01': 0.5,
          '02': 0.625,
          '03': 0.75,
          '04': 0.875,
          '05': 1,
          '06': 1.125,
          '07': 1.25,
          '08': 1.5,
          '09': 1.75,
          '10': 2,
          '11': 2.25,
          '12': 3,
          '13': 3.75
        },
        rem
      )
    ),
    weight: withUno(
      { slots: ['fontWeight'], keyFrom: 'category-sub' },
      scale({ '01': 300, '02': 400, '03': 500, '04': 600, '05': 700 }, fontWeight)
    ),
    'line-height': withUno(
      { slots: ['lineHeight'], keyFrom: 'category-sub' },
      scale(
        {
          '01': 1.1,
          '02': 1.15,
          '03': 1.2,
          '04': 1.25,
          '05': 1.3,
          '06': 1.4,
          '07': 1.5,
          '08': 1.6,
          '09': 1.7
        },
        num
      )
    ),
    'letter-spacing': withUno(
      { slots: ['letterSpacing'], keyFrom: 'category-sub' },
      scale(
        {
          '01': -0.04,
          '02': -0.03,
          '03': -0.02,
          '04': -0.01,
          '05': 0,
          '06': 0.01,
          '07': 0.02,
          '08': 0.03,
          '09': 0.04,
          '10': 0.05
        },
        rem
      )
    )
  }
} as const
