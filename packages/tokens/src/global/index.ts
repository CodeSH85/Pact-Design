import type { DtcgType, TypedTokenPath } from '../dsl/index.ts'
import { globalBorder } from './border.ts'
import { globalColor } from './color.ts'
import { globalElevation } from './elevation.ts'
import { globalMotion } from './motion.ts'
import { globalSizing } from './sizing.ts'
import { globalSpacing } from './spacing.ts'
import { globalTypography } from './typography.ts'

export const globalFiles = {
  'global/border': { global: globalBorder },
  'global/color': { global: globalColor },
  'global/elevation': { global: globalElevation },
  'global/motion': { global: globalMotion },
  'global/sizing': { global: globalSizing },
  'global/spacing': { global: globalSpacing },
  'global/typography': { global: globalTypography }
} as const

export const globalTokens = {
  global: {
    ...globalBorder,
    ...globalColor,
    ...globalElevation,
    ...globalMotion,
    ...globalSizing,
    ...globalSpacing,
    ...globalTypography
  }
} as const

export type GlobalTree = typeof globalTokens
export type GlobalRefPath<T extends DtcgType> = TypedTokenPath<GlobalTree, T>
