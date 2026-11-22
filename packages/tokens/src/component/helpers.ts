import { colorLiteral, ref, refMap } from '../dsl/index.ts'
import type { FoundationRefPath } from '../system/index.ts'

export type ColorRefInput = FoundationRefPath<'color'> | 'transparent'
export type DimPath = FoundationRefPath<'dimension'>
export type ShadowPath = FoundationRefPath<'shadow'>
export type ZIndexPath = FoundationRefPath<'number'>

export const dim = (path: DimPath) => ref('dimension', path)
export const dimMap = <K extends string>(entries: Record<K, DimPath>) => refMap('dimension', entries)
export const shadowRef = (path: ShadowPath) => ref('shadow', path)
export const zIndexRef = (path: ZIndexPath) => ref('number', path)

export const colorVal = (v: ColorRefInput) =>
  v === 'transparent' ? colorLiteral('transparent') : ref('color', v)

export const colorMap = <K extends string>(entries: Record<K, ColorRefInput>) =>
  Object.fromEntries(
    Object.entries(entries).map(([k, v]) => [k, colorVal(v as ColorRefInput)])
  ) as Record<K, ReturnType<typeof colorVal>>

/**
 * Shared 5-step (xs..xl) control sizing tokens used by Button and Field.
 */
export function controlGeometry() {
  return {
    height: dimMap({
      xs: 'system.control.height.xs',
      sm: 'system.control.height.sm',
      md: 'system.control.height.md',
      lg: 'system.control.height.lg',
      xl: 'system.control.height.xl'
    }),
    'padding-x': dimMap({
      xs: 'system.spacing.xs',
      sm: 'system.spacing.sm',
      md: 'system.spacing.md',
      lg: 'system.spacing.lg',
      xl: 'system.spacing.xl'
    }),
    gap: dimMap({
      xs: 'system.spacing.2xs',
      sm: 'system.spacing.xs',
      md: 'system.spacing.xs',
      lg: 'system.spacing.sm',
      xl: 'system.spacing.sm'
    }),
    radius: dimMap({
      none: 'system.radius.none',
      xs: 'system.radius.2xs',
      sm: 'system.radius.xs',
      md: 'system.radius.sm',
      lg: 'system.radius.md',
      xl: 'system.radius.lg',
      full: 'system.radius.xl'
    })
  }
}
