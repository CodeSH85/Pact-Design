import { colorLiteral, ref, refMap } from '../factory.ts'
import type { FoundationRefPath } from '../system/index.ts'

export type ColorRefInput = FoundationRefPath<'color'> | 'transparent'
export type DimPath = FoundationRefPath<'dimension'>
export type ShadowPath = FoundationRefPath<'shadow'>
export type ZIndexPath = FoundationRefPath<'number'>

export const dim = (path: DimPath) => ref('dimension', path)
export const dimMap = <K extends string>(entries: Record<K, DimPath>) => refMap('dimension', entries)
export const shadowRef = (path: ShadowPath) => ref('shadow', path)
export const zIndexRef = (path: ZIndexPath) => ref('number', path)

export const colorRef = (v: ColorRefInput) =>
  v === 'transparent' ? colorLiteral('transparent') : ref('color', v)

export const colorMap = <K extends string>(entries: Record<K, ColorRefInput>) =>
  Object.fromEntries(
    Object.entries(entries).map(([k, v]) => [k, colorRef(v as ColorRefInput)])
  ) as Record<K, ReturnType<typeof colorRef>>

/**
 * Shared 5-step (xs..xl) control sizing tokens used by Button and Field.
 */
export function controlGeometry() {
  return {
    height: dimMap({
      xs: 'pd.system.size.control.xs',
      sm: 'pd.system.size.control.sm',
      md: 'pd.system.size.control.md',
      lg: 'pd.system.size.control.lg',
      xl: 'pd.system.size.control.xl'
    }),
    'padding-x': dimMap({
      xs: 'pd.system.spacing.xs',
      sm: 'pd.system.spacing.sm',
      md: 'pd.system.spacing.md',
      lg: 'pd.system.spacing.lg',
      xl: 'pd.system.spacing.xl'
    }),
    gap: dimMap({
      xs: 'pd.system.spacing.2xs',
      sm: 'pd.system.spacing.xs',
      md: 'pd.system.spacing.xs',
      lg: 'pd.system.spacing.sm',
      xl: 'pd.system.spacing.sm'
    }),
    radius: dimMap({
      none: 'pd.system.radius.none',
      xs: 'pd.system.radius.2xs',
      sm: 'pd.system.radius.xs',
      md: 'pd.system.radius.sm',
      lg: 'pd.system.radius.md',
      xl: 'pd.system.radius.lg',
      full: 'pd.system.radius.xl'
    })
  }
}
