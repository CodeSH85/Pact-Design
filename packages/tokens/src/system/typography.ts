import { refMap, typography } from '../dsl/index.ts'
import type { GlobalRefPath } from '../global/index.ts'

type FontSizeStep = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13'
type FontWeightName = 'normal' | 'medium' | 'bold'
type LineHeightStep = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09'
type LetterSpacingStep = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'

function typeStyle(
  size: FontSizeStep,
  weight: FontWeightName,
  lineHeight: LineHeightStep,
  letterSpacing: LetterSpacingStep,
  family: 'sans' | 'mono' = 'sans'
) {
  const familyPath: GlobalRefPath<'fontFamily'> = `global.font.family.${family}`
  const sizePath: GlobalRefPath<'dimension'> = `global.font.size.${size}`
  const lhPath: GlobalRefPath<'number'> = `global.font.line-height.${lineHeight}`
  const lsPath: GlobalRefPath<'dimension'> = `global.font.letter-spacing.${letterSpacing}`

  return typography({
    fontFamily: `{${familyPath}}`,
    fontSize: `{${sizePath}}`,
    fontWeight: `{system.font.weight.${weight}}`,
    lineHeight: `{${lhPath}}`,
    letterSpacing: `{${lsPath}}`
  })
}

export const systemTypography = {
  font: {
    weight: refMap('fontWeight', {
      normal: 'global.font.weight.02',
      medium: 'global.font.weight.03',
      bold: 'global.font.weight.04'
    } satisfies Record<FontWeightName, GlobalRefPath<'fontWeight'>>),
    display: {
      sm: typeStyle('11', 'bold', '02', '03'),
      md: typeStyle('12', 'bold', '01', '02')
    },
    heading: {
      xs: typeStyle('05', 'bold', '06', '05'),
      sm: typeStyle('06', 'bold', '06', '04'),
      md: typeStyle('07', 'bold', '05', '04'),
      lg: typeStyle('08', 'bold', '04', '04'),
      xl: typeStyle('10', 'bold', '03', '03')
    },
    body: {
      sm: typeStyle('04', 'normal', '07', '05'),
      md: typeStyle('05', 'normal', '07', '05'),
      lg: typeStyle('06', 'normal', '08', '05')
    },
    label: {
      xs: typeStyle('03', 'normal', '05', '07'),
      sm: typeStyle('04', 'normal', '05', '06'),
      md: typeStyle('05', 'normal', '05', '05'),
      lg: typeStyle('06', 'normal', '05', '05')
    },
    caption: {
      sm: typeStyle('02', 'normal', '06', '07'),
      md: typeStyle('03', 'normal', '06', '06')
    },
    mono: {
      xs: typeStyle('03', 'normal', '06', '05', 'mono'),
      sm: typeStyle('04', 'normal', '06', '05', 'mono')
    }
  }
} as const
