import {
  cloneElement,
  createElement,
  isValidElement,
  type ComponentType,
  type ReactElement,
  type ReactNode
} from 'react'
import { clsx } from 'clsx'
import { defaultIcons } from './defaults.ts'
import { type IconSlot, type PactIconName, type PactIconProps } from './types.ts'

type RenderableIconComponent = ComponentType<{
  className?: string
  'aria-hidden'?: boolean | 'true' | 'false'
  [key: string]: unknown
}>

function isIconComponent(
  value: IconSlot | ComponentType<PactIconProps>
): value is RenderableIconComponent {
  if (typeof value === 'function') return true
  if (typeof value === 'object' && value !== null && !isValidElement(value) && '$$typeof' in value) {
    return true
  }
  return false
}

export function renderIcon(
  slot: IconSlot | undefined,
  fallback: PactIconName,
  className?: string,
  extraProps?: Record<string, unknown>
): ReactNode {
  if (slot === null || slot === false) {
    return null
  }

  const resolved: IconSlot | ComponentType<PactIconProps> = slot ?? defaultIcons[fallback]

  if (isIconComponent(resolved)) {
    const IconComp = resolved as RenderableIconComponent
    return createElement(IconComp, {
      className,
      'aria-hidden': 'true',
      ...extraProps
    })
  }

  if (isValidElement(resolved)) {
    const element = resolved as ReactElement<{
      className?: string
      'aria-hidden'?: boolean | 'true' | 'false'
    }>
    return cloneElement(element, {
      'aria-hidden': element.props['aria-hidden'] ?? 'true',
      ...extraProps,
      className: clsx(className, element.props.className)
    })
  }

  return resolved as ReactNode
}
