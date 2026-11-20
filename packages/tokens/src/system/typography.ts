import { typography, withUno } from '../dsl/index.ts'
import type { GlobalRefPath } from '../global/index.ts'

type FontSizeStep = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13'
type FontWeightStep = '01' | '02' | '03' | '04' | '05'
type LineHeightStep = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09'
type LetterSpacingStep = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'

function typeStyle(
  size: FontSizeStep,
  weight: FontWeightStep,
  lineHeight: LineHeightStep,
  letterSpacing: LetterSpacingStep,
  family: 'sans' | 'mono' = 'sans'
) {
  const familyPath: GlobalRefPath<'fontFamily'> = `global.font.family.${family}`
  const sizePath: GlobalRefPath<'dimension'> = `global.font.size.${size}`
  const weightPath: GlobalRefPath<'fontWeight'> = `global.font.weight.${weight}`
  const lhPath: GlobalRefPath<'number'> = `global.font.line-height.${lineHeight}`
  const lsPath: GlobalRefPath<'dimension'> = `global.font.letter-spacing.${letterSpacing}`

  return typography({
    fontFamily: `{${familyPath}}`,
    fontSize: `{${sizePath}}`,
    fontWeight: `{${weightPath}}`,
    lineHeight: `{${lhPath}}`,
    letterSpacing: `{${lsPath}}`
  })
}

export const systemTypography = {
  font: withUno({ slots: ['fontSize'], keyFrom: 'category', typographyTuple: true }, {
    display: {
      sm: typeStyle('11', '05', '02', '03'),
      md: typeStyle('12', '05', '01', '02'),
      lg: typeStyle('13', '05', '01', '01')
    },
    heading: {
      xs: typeStyle('07', '04', '05', '04'),
      sm: typeStyle('08', '04', '05', '04'),
      md: typeStyle('09', '05', '04', '03'),
      lg: typeStyle('10', '05', '03', '03'),
      xl: typeStyle('11', '05', '02', '03')
    },
    subheader: {
      sm: typeStyle('05', '03', '06', '05'),
      md: typeStyle('06', '03', '06', '05'),
      lg: typeStyle('07', '03', '06', '04')
    },
    body: {
      xs: typeStyle('03', '02', '07', '06'),
      sm: typeStyle('04', '02', '07', '05'),
      md: typeStyle('05', '02', '07', '05'),
      lg: typeStyle('06', '02', '08', '05'),
      xl: typeStyle('07', '02', '08', '05')
    },
    label: {
      xs: typeStyle('03', '03', '05', '07'),
      sm: typeStyle('04', '03', '05', '06'),
      md: typeStyle('05', '03', '05', '05'),
      lg: typeStyle('06', '03', '05', '05'),
      xl: typeStyle('07', '03', '05', '05')
    },
    caption: {
      sm: typeStyle('02', '02', '06', '07'),
      md: typeStyle('03', '02', '06', '06'),
      lg: typeStyle('04', '02', '06', '06')
    },
    mono: {
      xs: typeStyle('03', '02', '06', '05', 'mono'),
      sm: typeStyle('04', '02', '06', '05', 'mono'),
      md: typeStyle('05', '02', '07', '05', 'mono')
    }
  })
} as const
