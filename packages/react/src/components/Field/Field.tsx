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
    'bg-field-bg border border-field-border rounded-field-sm text-field-text',
    'transition-colors duration-fast ease-default',
    'hover:border-field-border-hover',
    'data-[focused]:border-field-border-focus data-[focus-within]:border-field-border-focus',
    'data-[invalid]:border-field-border-invalid data-[invalid]:hover:border-field-border-invalid-hover',
    'data-[disabled]:bg-field-bg-disabled data-[disabled]:border-field-border-disabled data-[disabled]:text-field-text-disabled data-[disabled]:cursor-not-allowed'
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'h-field-xs px-field-padding-x-xs gap-field-gap-xs text-label-xs rounded-field-xs',
        sm: 'h-field-sm px-field-padding-x-sm gap-field-gap-sm text-label-sm rounded-field-sm',
        md: 'h-field-md px-field-padding-x-md gap-field-gap-md text-label-md rounded-field-md',
        lg: 'h-field-lg px-field-padding-x-lg gap-field-gap-lg text-label-lg rounded-field-lg',
        xl: 'h-field-xl px-field-padding-x-xl gap-field-gap-xl text-label-xl rounded-field-xl'
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
