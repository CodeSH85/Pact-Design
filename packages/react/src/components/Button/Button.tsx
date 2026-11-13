import { type ReactNode } from 'react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import { composeTailwindRenderProps, disabledStyles, focusRing } from '../../utils/index.ts'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center select-none cursor-pointer',
    'transition-colors duration-fast ease-default',
    focusRing,
    disabledStyles
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-on-primary border border-transparent',
          'hover:bg-primary-hover data-[hovered]:bg-primary-hover',
          'active:bg-primary-active data-[pressed]:bg-primary-active'
        ].join(' '),
        secondary: [
          'bg-layer-1 text-on-surface border border-border-default',
          'hover:bg-layer-1-hover data-[hovered]:bg-layer-1-hover',
          'active:bg-layer-1-active data-[pressed]:bg-layer-1-active'
        ].join(' '),
        ghost: [
          'bg-transparent text-on-surface border border-transparent',
          'hover:bg-hover data-[hovered]:bg-hover',
          'active:bg-active data-[pressed]:bg-active'
        ].join(' '),
        danger: [
          'bg-danger text-on-danger border border-transparent',
          'hover:bg-danger-hover data-[hovered]:bg-danger-hover',
          'active:bg-danger-active data-[pressed]:bg-danger-active'
        ].join(' '),
        subtle: [
          'bg-info-subtle text-on-info-subtle border border-info-border',
          'hover:bg-layer-2-hover data-[hovered]:bg-layer-2-hover',
          'active:bg-layer-2-active data-[pressed]:bg-layer-2-active'
        ].join(' ')
      },
      size: {
        xs: 'h-control-xs px-xs gap-2xs text-label-xs rounded-xs',
        sm: 'h-control-sm px-sm gap-xs text-label-sm rounded-sm',
        md: 'h-control-md px-md gap-xs text-label-md rounded-sm',
        lg: 'h-control-lg px-lg gap-sm text-label-lg rounded-md',
        xl: 'h-control-xl px-xl gap-sm text-label-xl rounded-md'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export interface ButtonProps
  extends Omit<AriaButtonProps, 'children'>,
  VariantProps<typeof buttonVariants> {
  disabled?: boolean
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
      isDisabled={isDisabled ?? disabled}
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
