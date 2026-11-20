import type { DtcgType, TypedTokenPath } from '../dsl/index.ts'
import type { GlobalTree } from '../global/index.ts'
import { systemBorder } from './border.ts'
import { systemColor } from './color.ts'
import { systemElevation } from './elevation.ts'
import { systemMotion } from './motion.ts'
import { systemSizing } from './sizing.ts'
import { systemSpacing } from './spacing.ts'
import { systemTypography } from './typography.ts'

export const systemFiles = {
  'system/border': { system: systemBorder },
  'system/color': { system: systemColor },
  'system/elevation': { system: systemElevation },
  'system/motion': { system: systemMotion },
  'system/sizing': { system: systemSizing },
  'system/spacing': { system: systemSpacing },
  'system/typography': { system: systemTypography }
} as const

export const systemTokens = {
  system: {
    ...systemBorder,
    ...systemColor,
    border: {
      ...systemBorder.border,
      ...systemColor.border
    },
    ...systemElevation,
    ...systemMotion,
    ...systemSizing,
    ...systemSpacing,
    ...systemTypography
  }
} as const

export type FoundationTree = GlobalTree & typeof systemTokens
export type FoundationRefPath<T extends DtcgType> = TypedTokenPath<FoundationTree, T>
