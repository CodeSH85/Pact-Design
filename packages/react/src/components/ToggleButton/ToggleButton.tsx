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
      data-variant={variant}
      data-size={size}
      data-radius={radius}
      data-icon={icon ? '' : undefined}
      className={composeRenderProps(className, (cn) => clsx('pd-reset', 'pd-toggle-button', cn))}
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
      className={composeRenderProps(className, (cn) => clsx('pd-toggle-button-group', cn))}
      {...ariaProps}
    >
      {children}
    </AriaToggleButtonGroup>
  )
}

export default ToggleButton
