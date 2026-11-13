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
          'bg-layer-1 text-on-surface border border-border-default',
          'hover:bg-layer-1-hover data-[hovered]:bg-layer-1-hover',
          'active:bg-layer-1-active data-[pressed]:bg-layer-1-active',
          'data-[selected]:bg-layer-1-selected data-[selected]:border-border-strong data-[selected]:text-on-surface'
        ].join(' '),
        ghost: [
          'bg-transparent text-on-surface border border-transparent',
          'hover:bg-hover data-[hovered]:bg-hover',
          'active:bg-active data-[pressed]:bg-active',
          'data-[selected]:bg-layer-1-selected data-[selected]:text-on-surface'
        ].join(' '),
        primary: [
          'bg-layer-1 text-on-surface border border-border-default',
          'hover:bg-layer-1-hover data-[hovered]:bg-layer-1-hover',
          'data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:border-transparent',
          'data-[selected]:hover:bg-primary-hover data-[selected]:active:bg-primary-active'
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
