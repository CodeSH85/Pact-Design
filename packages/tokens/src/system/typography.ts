import { refMap, typography } from '../factory.ts'
import type { GlobalRefPath } from '../global/index.ts'

type FontFamilyName = 'sans' | 'mono'
type FontSizeStep = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13'
type FontWeightName = 'normal' | 'medium' | 'bold'
type LineHeightStep = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09'
type LetterSpacingStep = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'

function typeStyle(
  size: FontSizeStep,
  weight: FontWeightName,
  lineHeight: LineHeightStep,
  letterSpacing: LetterSpacingStep,
  family: FontFamilyName = 'sans'
) {
  const sizePath: GlobalRefPath<'dimension'> = `pd.global.font.size.${size}`
  const lhPath: GlobalRefPath<'number'> = `pd.global.font.line-height.${lineHeight}`
  const lsPath: GlobalRefPath<'dimension'> = `pd.global.font.letter-spacing.${letterSpacing}`

  return typography({
    fontFamily: `{pd.system.font.family.${family}}`,
    fontSize: `{${sizePath}}`,
    fontWeight: `{pd.system.font.weight.${weight}}`,
    lineHeight: `{${lhPath}}`,
    letterSpacing: `{${lsPath}}`
  })
}

function headingStyle(
  size: FontSizeStep,
  lineHeight: LineHeightStep,
  letterSpacing: LetterSpacingStep
) {
  return {
    $root: typeStyle(size, 'bold', lineHeight, letterSpacing),
    normal: typeStyle(size, 'normal', lineHeight, letterSpacing),
    medium: typeStyle(size, 'medium', lineHeight, letterSpacing)
  } as const
}

export const systemFont = {
  family: refMap('fontFamily', {
    sans: 'pd.global.font.family.sans',
    mono: 'pd.global.font.family.mono'
  } satisfies Record<FontFamilyName, GlobalRefPath<'fontFamily'>>),
  weight: refMap('fontWeight', {
    normal: 'pd.global.font.weight.02',
    medium: 'pd.global.font.weight.03',
    bold: 'pd.global.font.weight.04'
  } satisfies Record<FontWeightName, GlobalRefPath<'fontWeight'>>),
  display: {
    sm: typeStyle('11', 'bold', '02', '03'),
    md: typeStyle('12', 'bold', '01', '02')
  },
  heading: {
    xs: headingStyle('05', '06', '05'),
    sm: headingStyle('06', '06', '04'),
    md: headingStyle('07', '05', '04'),
    lg: headingStyle('08', '04', '04'),
    xl: headingStyle('10', '03', '03')
  },
  body: {
    sm: typeStyle('04', 'normal', '08', '05'),
    md: typeStyle('05', 'normal', '08', '05'),
    lg: typeStyle('06', 'normal', '09', '05')
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
} as const
