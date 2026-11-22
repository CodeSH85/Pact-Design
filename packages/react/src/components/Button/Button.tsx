import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps
} from 'react-aria-components'
import {
  resolveDisabled,
  type DisableableProps
} from '../../utils/index.ts'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonRadius = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ButtonProps
  extends Omit<AriaButtonProps, 'children'>,
  DisableableProps {
  variant?: ButtonVariant
  size?: ButtonSize
  radius?: ButtonRadius
  children?: ReactNode | AriaButtonProps['children']
}

export function Button({
  variant = 'primary',
  size = 'md',
  radius = 'sm',
  disabled,
  isDisabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      isDisabled={resolveDisabled({ disabled, isDisabled })}
      data-variant={variant}
      data-size={size}
      data-radius={radius}
      className={composeRenderProps(className, (cn) => clsx('pd-reset', 'pd-button', cn))}
      {...props}
    >
      {children}
    </AriaButton>
  )
}

export default Button
