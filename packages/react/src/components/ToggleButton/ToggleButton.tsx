import { type ReactNode } from 'react'
import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps
} from 'react-aria-components'
import { dataAttrs, pdClass } from '../../internal/index.ts'
import {
  resolveDisableableProps,
  type DisableableProps
} from '../../utils/index.ts'
import type { ButtonRadius, ButtonSize } from '../Button/index.ts'

export type ToggleButtonVariant = 'secondary' | 'ghost' | 'primary'
export type ToggleButtonSize = ButtonSize
export type ToggleButtonRadius = ButtonRadius

export interface ToggleButtonProps
  extends Omit<AriaToggleButtonProps, 'children'>,
  DisableableProps {
  variant?: ToggleButtonVariant
  size?: ToggleButtonSize
  radius?: ToggleButtonRadius
  icon?: boolean
  children?: ReactNode | AriaToggleButtonProps['children']
}

export function ToggleButton({
  variant = 'secondary',
  size = 'md',
  radius,
  icon = false,
  className,
  children,
  ...props
}: ToggleButtonProps) {
  const ariaProps = resolveDisableableProps(props)

  return (
    <AriaToggleButton
      {...dataAttrs({ variant, size, radius, icon })}
      className={pdClass(className, 'pd-reset', 'pd-toggle-button')}
      {...ariaProps}
    >
      {children}
    </AriaToggleButton>
  )
}

export interface ToggleButtonGroupProps
  extends Omit<AriaToggleButtonGroupProps, 'children'>,
  DisableableProps {
  children?: ReactNode | AriaToggleButtonGroupProps['children']
}

export function ToggleButtonGroup({ className, children, ...props }: ToggleButtonGroupProps) {
  const ariaProps = resolveDisableableProps(props)

  return (
    <AriaToggleButtonGroup
      className={pdClass(className, 'pd-toggle-button-group')}
      {...ariaProps}
    >
      {children}
    </AriaToggleButtonGroup>
  )
}

export default ToggleButton
