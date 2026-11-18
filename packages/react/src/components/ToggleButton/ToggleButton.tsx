import { type ReactNode } from 'react'
import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  composeTailwindRenderProps,
  resolveDisabled,
  type DisableableProps
} from '../../utils/index.ts'
import { buttonBaseClasses, buttonSizeVariants } from '../Button/index.ts'

export const toggleButtonVariants = cva(
  buttonBaseClasses,
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
      size: buttonSizeVariants
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md'
    }
  }
)

export interface ToggleButtonProps
  extends Omit<AriaToggleButtonProps, 'children'>,
  VariantProps<typeof toggleButtonVariants>,
  DisableableProps {
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
      isDisabled={resolveDisabled({ disabled, isDisabled })}
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
