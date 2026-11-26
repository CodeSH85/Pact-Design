import { type ComponentType, type ReactNode, type SVGProps } from 'react'

export interface PactIconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number | string
  color?: string
  children?: never
}

export type IconComponent = ComponentType<{ className?: string }>

export type IconSlot = ReactNode | IconComponent

export type PactIconName =
  | 'chevronDown'
  | 'chevronRight'
  | 'chevronLeft'
  | 'check'
  | 'indeterminate'
  | 'close'
  | 'clear'
  | 'search'
  | 'calendar'
  | 'upload'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
