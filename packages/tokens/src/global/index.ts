import type { DtcgType, TypedTokenPath } from '../factory.ts'
import { globalBorder } from './border.ts'
import { globalColor } from './color.ts'
import { globalElevation } from './elevation.ts'
import { globalMotion } from './motion.ts'
import { globalRadius } from './radius.ts'
import { globalSize } from './sizing.ts'
import { globalSpacing } from './spacing.ts'
import { globalFont } from './typography.ts'

export const globalTokens = {
  border: globalBorder,
  color: globalColor,
  elevation: globalElevation,
  font: globalFont,
  motion: globalMotion,
  radius: globalRadius,
  size: globalSize,
  spacing: globalSpacing
} as const

export type GlobalTree = { pd: { global: typeof globalTokens } }
export type GlobalRefPath<T extends DtcgType> = TypedTokenPath<GlobalTree, T>
export type GlobalColorKey = TypedTokenPath<typeof globalColor, 'color'>
