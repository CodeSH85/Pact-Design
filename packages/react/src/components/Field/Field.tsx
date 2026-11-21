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
