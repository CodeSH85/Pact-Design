import { type ReactNode } from 'react'
import {
  FieldError as AriaFieldError,
  type FieldErrorProps as AriaFieldErrorProps,
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  Text as AriaText,
  type TextProps as AriaTextProps
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, composeTailwindRenderProps } from '../../utils/index.ts'

export interface LabelProps extends AriaLabelProps {
  className?: string
  children?: ReactNode
}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <AriaLabel
      className={cn(
        'text-label-sm font-medium text-on-surface select-none cursor-default',
        className
      )}
      {...props}
    >
      {children}
    </AriaLabel>
  )
}

export interface FieldDescriptionProps extends AriaTextProps {
  className?: string
  children?: ReactNode
}

export function FieldDescription({ className, children, ...props }: FieldDescriptionProps) {
  return (
    <AriaText
      slot="description"
      className={cn(
        'text-caption-md text-on-surface-muted',
        className
      )}
      {...props}
    >
      {children}
    </AriaText>
  )
}

export interface FieldErrorProps extends AriaFieldErrorProps {
  className?: string
  children?: ReactNode | AriaFieldErrorProps['children']
}

export function FieldError({ className, children, ...props }: FieldErrorProps) {
  return (
    <AriaFieldError
      className={composeTailwindRenderProps(
        className,
        'text-caption-md text-on-danger-subtle'
      )}
      {...props}
    >
      {children}
    </AriaFieldError>
  )
}

export const fieldGroupVariants = cva(
  [
    'inline-flex items-center w-full select-none',
    'bg-layer-1 border border-border-default rounded-sm text-on-surface',
    'transition-colors duration-fast ease-default',
    'hover:border-border-strong',
    'data-[focused]:border-border-focus data-[focus-within]:border-border-focus',
    'data-[invalid]:border-danger data-[invalid]:hover:border-danger-hover',
    'data-[disabled]:bg-disabled data-[disabled]:border-border-subtle data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed'
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'h-control-xs px-xs gap-2xs text-label-xs rounded-xs',
        sm: 'h-control-sm px-sm gap-xs text-label-sm rounded-sm',
        md: 'h-control-md px-md gap-xs text-label-md rounded-sm',
        lg: 'h-control-lg px-lg gap-sm text-label-lg rounded-md',
        xl: 'h-control-xl px-xl gap-sm text-label-xl rounded-md'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export interface FieldGroupProps
  extends AriaGroupProps,
  VariantProps<typeof fieldGroupVariants> {
  className?: string
}

export function FieldGroup({ size = 'md', className, children, ...props }: FieldGroupProps) {
  return (
    <AriaGroup
      className={composeTailwindRenderProps(className, fieldGroupVariants({ size }))}
      {...props}
    >
      {children}
    </AriaGroup>
  )
}
