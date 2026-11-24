import type { DtcgType, TypedTokenPath } from '../factory.ts'
import type { globalTokens } from '../global/index.ts'
import { systemBorder } from './border.ts'
import { systemColor } from './color.ts'
import { systemElevation } from './elevation.ts'
import { systemMotion } from './motion.ts'
import { systemRadius } from './radius.ts'
import { systemSize } from './sizing.ts'
import { systemSpacing } from './spacing.ts'
import { systemFont } from './typography.ts'

export const systemTokens = {
  border: systemBorder,
  color: systemColor,
  elevation: systemElevation,
  font: systemFont,
  motion: systemMotion,
  radius: systemRadius,
  size: systemSize,
  spacing: systemSpacing
} as const

export type FoundationTree = {
  pd: {
    global: typeof globalTokens
    system: typeof systemTokens
  }
}
export type FoundationRefPath<T extends DtcgType> = TypedTokenPath<FoundationTree, T>
