import { type ReactNode } from 'react'
import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import { composeTailwindRenderProps, disabledStyles, focusRing } from '../../utils/index.ts'

export const toggleButtonVariants = cva(
  [
    'inline-flex items-center justify-center select-none cursor-pointer',
    'transition-colors duration-fast ease-default',
    focusRing,
    disabledStyles
  ].join(' '),
  {
    variants: {
      variant: {
        secondary: [
          'bg-button-secondary-bg text-button-secondary-text border border-button-secondary-border',
          'hover:bg-button-secondary-bg-hover data-[hovered]:bg-button-secondary-bg-hover',
          'active:bg-button-secondary-bg-active data-[pressed]:bg-button-secondary-bg-active',
          'data-[selected]:bg-button-secondary-bg-selected data-[selected]:border-button-secondary-border-selected data-[selected]:text-button-secondary-text-selected'
        ].join(' '),
        ghost: [
          'bg-button-ghost-bg text-button-ghost-text border border-button-ghost-border',
          'hover:bg-button-ghost-bg-hover data-[hovered]:bg-button-ghost-bg-hover',
          'active:bg-button-ghost-bg-active data-[pressed]:bg-button-ghost-bg-active',
          'data-[selected]:bg-button-ghost-bg-selected data-[selected]:text-button-ghost-text-selected'
        ].join(' '),
        primary: [
          'bg-button-secondary-bg text-button-secondary-text border border-button-secondary-border',
          'hover:bg-button-secondary-bg-hover data-[hovered]:bg-button-secondary-bg-hover',
          'data-[selected]:bg-button-primary-bg data-[selected]:text-button-primary-text data-[selected]:border-button-primary-border',
          'data-[selected]:hover:bg-button-primary-bg-hover data-[selected]:active:bg-button-primary-bg-active'
        ].join(' ')
      },
      size: {
        xs: 'h-button-xs px-button-padding-x-xs gap-button-gap-xs text-label-xs rounded-button-xs',
        sm: 'h-button-sm px-button-padding-x-sm gap-button-gap-sm text-label-sm rounded-button-sm',
        md: 'h-button-md px-button-padding-x-md gap-button-gap-md text-label-md rounded-button-md',
        lg: 'h-button-lg px-button-padding-x-lg gap-button-gap-lg text-label-lg rounded-button-lg',
        xl: 'h-button-xl px-button-padding-x-xl gap-button-gap-xl text-label-xl rounded-button-xl'
      }
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md'
    }
  }
)

export interface ToggleButtonProps
  extends Omit<AriaToggleButtonProps, 'children'>,
  VariantProps<typeof toggleButtonVariants> {
  disabled?: boolean
  children?: ReactNode | AriaToggleButtonProps['children']
}

export function ToggleButton({
  variant = 'secondary',
  size = 'md',
  disabled,
  isDisabled,
  className,
  children,
  ...props
}: ToggleButtonProps) {
  return (
    <AriaToggleButton
      isDisabled={isDisabled ?? disabled}
      className={composeTailwindRenderProps(
        className,
        toggleButtonVariants({ variant, size })
      )}
      {...props}
    >
      {children}
    </AriaToggleButton>
  )
}

export interface ToggleButtonGroupProps extends AriaToggleButtonGroupProps {
  className?: string
  children?: ReactNode
}

export function ToggleButtonGroup({ className, children, ...props }: ToggleButtonGroupProps) {
  return (
    <AriaToggleButtonGroup
      className={composeTailwindRenderProps(
        className,
        'inline-flex items-center gap-2xs'
      )}
      {...props}
    >
      {children}
    </AriaToggleButtonGroup>
  )
}

export default ToggleButton
