import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps
} from 'react-aria-components'
import {
  resolveDisabled,
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
  disabled,
  isDisabled,
  className,
  children,
  ...props
}: ToggleButtonProps) {
  return (
    <AriaToggleButton
      isDisabled={resolveDisabled({ disabled, isDisabled })}
      data-variant={variant}
      data-size={size}
      data-radius={radius}
      data-icon={icon ? '' : undefined}
      className={composeRenderProps(className, (cn) => clsx('pd-reset', 'pd-toggle-button', cn))}
      {...props}
    >
      {children}
    </AriaToggleButton>
  )
}

export interface ToggleButtonGroupProps extends Omit<AriaToggleButtonGroupProps, 'children'> {
  children?: ReactNode | AriaToggleButtonGroupProps['children']
}

export function ToggleButtonGroup({ className, children, ...props }: ToggleButtonGroupProps) {
  return (
    <AriaToggleButtonGroup
      className={composeRenderProps(className, (cn) => clsx('pd-toggle-button-group', cn))}
      {...props}
    >
      {children}
    </AriaToggleButtonGroup>
  )
}

export default ToggleButton
