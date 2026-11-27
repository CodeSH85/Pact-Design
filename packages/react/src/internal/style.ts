import { clsx, type ClassValue } from 'clsx'
import { composeRenderProps } from 'react-aria-components'

export type RenderClassName<T> = string | ((values: T) => string) | undefined

/**
 * Composes React Aria render-prop `className` values with base `pd-*` class names.
 */
export function pdClass<T>(
  className: RenderClassName<T>,
  ...base: ClassValue[]
): string | ((values: T) => string) {
  return composeRenderProps(className, (cn) => clsx(...base, cn))
}

type DataAttrValue = string | number | boolean | undefined

/**
 * Converts style/state options into DOM `data-*` attributes.
 * - `true` maps to `""` (presence attribute)
 * - `false` and `undefined` are omitted
 */
export function dataAttrs(
  attrs: Record<string, DataAttrValue>
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue
    const attrName = key.startsWith('data-') ? key : `data-${key}`
    result[attrName] = value === true ? '' : String(value)
  }
  return result
}
