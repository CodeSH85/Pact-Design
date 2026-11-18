import { type ReactNode } from 'react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  composeTailwindRenderProps,
  disabledStyles,
  focusRing,
  resolveDisabled,
  type DisableableProps
} from '../../utils/index.ts'

export const buttonBaseClasses = [
  'inline-flex items-center justify-center select-none cursor-pointer',
  'transition-colors duration-fast ease-default',
  focusRing,
  disabledStyles
].join(' ')

export const buttonSizeVariants = {
  xs: 'h-button-xs px-button-padding-x-xs gap-button-gap-xs text-label-xs rounded-button-xs',
  sm: 'h-button-sm px-button-padding-x-sm gap-button-gap-sm text-label-sm rounded-button-sm',
  md: 'h-button-md px-button-padding-x-md gap-button-gap-md text-label-md rounded-button-md',
  lg: 'h-button-lg px-button-padding-x-lg gap-button-gap-lg text-label-lg rounded-button-lg',
  xl: 'h-button-xl px-button-padding-x-xl gap-button-gap-xl text-label-xl rounded-button-xl'
} as const

export const buttonVariants = cva(
  buttonBaseClasses,
  {
    variants: {
      variant: {
        primary: [
          'bg-button-primary-bg text-button-primary-text border border-button-primary-border',
          'hover:bg-button-primary-bg-hover data-[hovered]:bg-button-primary-bg-hover',
          'active:bg-button-primary-bg-active data-[pressed]:bg-button-primary-bg-active'
        ].join(' '),
        secondary: [
          'bg-button-secondary-bg text-button-secondary-text border border-button-secondary-border',
          'hover:bg-button-secondary-bg-hover data-[hovered]:bg-button-secondary-bg-hover',
          'active:bg-button-secondary-bg-active data-[pressed]:bg-button-secondary-bg-active'
        ].join(' '),
        ghost: [
          'bg-button-ghost-bg text-button-ghost-text border border-button-ghost-border',
          'hover:bg-button-ghost-bg-hover data-[hovered]:bg-button-ghost-bg-hover',
          'active:bg-button-ghost-bg-active data-[pressed]:bg-button-ghost-bg-active'
        ].join(' '),
        danger: [
          'bg-button-danger-bg text-button-danger-text border border-button-danger-border',
          'hover:bg-button-danger-bg-hover data-[hovered]:bg-button-danger-bg-hover',
          'active:bg-button-danger-bg-active data-[pressed]:bg-button-danger-bg-active'
        ].join(' '),
        subtle: [
          'bg-button-subtle-bg text-button-subtle-text border border-button-subtle-border',
          'hover:bg-button-subtle-bg-hover data-[hovered]:bg-button-subtle-bg-hover',
          'active:bg-button-subtle-bg-active data-[pressed]:bg-button-subtle-bg-active'
        ].join(' ')
      },
      size: buttonSizeVariants
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export interface ButtonProps
  extends Omit<AriaButtonProps, 'children'>,
  VariantProps<typeof buttonVariants>,
  DisableableProps {
  children?: ReactNode | AriaButtonProps['children']
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  isDisabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      isDisabled={resolveDisabled({ disabled, isDisabled })}
      className={composeTailwindRenderProps(
        className,
        buttonVariants({ variant, size })
      )}
      {...props}
    >
      {children}
    </AriaButton>
  )
}

export default Button
