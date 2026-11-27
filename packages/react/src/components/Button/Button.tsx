import { type ReactNode } from 'react'
import {
  Button as AriaButton,
  Link as AriaLink,
  type ButtonProps as AriaButtonProps,
  type LinkProps as AriaLinkProps
} from 'react-aria-components'
import { dataAttrs, pdClass } from '../../internal/index.ts'
import {
  resolveDisabled,
  type DisableableProps
} from '../../utils/index.ts'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle' | 'link'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonRadius = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ButtonBaseProps extends DisableableProps {
  variant?: ButtonVariant
  size?: ButtonSize
  radius?: ButtonRadius
  icon?: boolean
}

export interface ButtonActionProps
  extends Omit<AriaButtonProps, 'children'>,
  ButtonBaseProps {
  href?: undefined
  children?: ReactNode | AriaButtonProps['children']
}

export interface ButtonLinkProps
  extends Omit<AriaLinkProps, 'children'>,
  ButtonBaseProps {
  href: string
  children?: ReactNode | AriaLinkProps['children']
}

export type ButtonProps = ButtonActionProps | ButtonLinkProps

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    radius = 'sm',
    icon = false,
    disabled,
    isDisabled
  } = props
  const resolvedDisabled = resolveDisabled({ disabled, isDisabled })
  const attrs = dataAttrs({ variant, size, radius, icon })

  if (props.href !== undefined) {
    const {
      variant: _variant,
      size: _size,
      radius: _radius,
      icon: _icon,
      disabled: _disabled,
      isDisabled: _isDisabled,
      className,
      children,
      ...linkProps
    } = props

    return (
      <AriaLink
        {...(resolvedDisabled !== undefined ? { isDisabled: resolvedDisabled } : {})}
        {...attrs}
        className={pdClass(className, 'pd-reset', 'pd-button')}
        {...linkProps}
      >
        {children}
      </AriaLink>
    )
  }

  const {
    variant: _variant,
    size: _size,
    radius: _radius,
    icon: _icon,
    disabled: _disabled,
    isDisabled: _isDisabled,
    href: _href,
    className,
    children,
    ...buttonProps
  } = props

  return (
    <AriaButton
      {...(resolvedDisabled !== undefined ? { isDisabled: resolvedDisabled } : {})}
      {...attrs}
      className={pdClass(className, 'pd-reset', 'pd-button')}
      {...buttonProps}
    >
      {children}
    </AriaButton>
  )
}

export default Button
