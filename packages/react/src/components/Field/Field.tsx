import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
  FieldError as AriaFieldError,
  type FieldErrorProps as AriaFieldErrorProps,
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  Text as AriaText,
  type TextProps as AriaTextProps
} from 'react-aria-components'
import { cva } from 'class-variance-authority'
import {
  resolveDisabled,
  type DisableableProps
} from '../../utils/index.ts'

export type FieldSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface LabelProps extends AriaLabelProps {
  className?: string
  children?: ReactNode
}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <AriaLabel
      className={clsx('pd-field-label', className)}
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
      className={clsx('pd-field-description', className)}
      {...props}
    >
      {children}
    </AriaText>
  )
}

export interface FieldErrorProps extends Omit<AriaFieldErrorProps, 'children'> {
  children?: ReactNode | AriaFieldErrorProps['children']
}

export function FieldError({ className, children, ...props }: FieldErrorProps) {
  return (
    <AriaFieldError
      className={composeRenderProps(className, (cn) => clsx('pd-field-error', cn))}
      {...props}
    >
      {children}
    </AriaFieldError>
  )
}

/**
 * @deprecated Temporary legacy utility preset retained for unmigrated Phase 2C components
 * (Select, ComboBox, Autocomplete, DateField, DatePicker). Will be removed once those migrate.
 */
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

export interface FieldGroupProps extends AriaGroupProps {
  size?: FieldSize
}

export function FieldGroup({ size = 'md', className, children, ...props }: FieldGroupProps) {
  return (
    <AriaGroup
      data-size={size}
      className={composeRenderProps(className, (cn) => clsx('pd-field-group', cn))}
      {...props}
    >
      {children}
    </AriaGroup>
  )
}

export type InputProps = AriaInputProps

export function Input({ className, ...props }: InputProps) {
  return (
    <AriaInput
      className={composeRenderProps(className, (cn) => clsx('pd-reset', 'pd-field-input', cn))}
      {...props}
    />
  )
}

export interface FieldButtonProps
  extends Omit<AriaButtonProps, 'children'>,
  DisableableProps {
  children?: ReactNode | AriaButtonProps['children']
}

export function FieldButton({
  disabled,
  isDisabled,
  className,
  children,
  ...props
}: FieldButtonProps) {
  return (
    <AriaButton
      isDisabled={resolveDisabled({ disabled, isDisabled })}
      className={composeRenderProps(className, (cn) => clsx('pd-reset', 'pd-field-button', cn))}
      {...props}
    >
      {children}
    </AriaButton>
  )
}
