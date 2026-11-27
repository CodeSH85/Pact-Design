import { forwardRef, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
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
import { dataAttrs, pdClass } from '../../internal/index.ts'
import {
  resolveDisableableProps,
  resolveDisabled,
  type DisableableProps
} from '../../utils/index.ts'
import {
  Button,
  type ButtonActionProps,
  type ButtonRadius,
  type ButtonSize,
  type ButtonVariant
} from '../Button/index.ts'

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
      className={pdClass(className, 'pd-field-error')}
      {...props}
    >
      {children}
    </AriaFieldError>
  )
}

export interface FieldGroupProps extends AriaGroupProps, DisableableProps {
  size?: FieldSize
}

export function FieldGroup({ size = 'md', className, children, ...props }: FieldGroupProps) {
  const ariaProps = resolveDisableableProps(props)

  return (
    <AriaGroup
      {...dataAttrs({ size })}
      className={pdClass(className, 'pd-field-group')}
      {...ariaProps}
    >
      {children}
    </AriaGroup>
  )
}

export interface InputProps extends AriaInputProps, DisableableProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { disabled, isDisabled, className, ...props },
  ref
) {
  return (
    <AriaInput
      ref={ref}
      disabled={resolveDisabled({ disabled, isDisabled })}
      className={pdClass(className, 'pd-reset', 'pd-field-input')}
      {...props}
    />
  )
})

export interface FieldButtonProps
  extends Omit<ButtonActionProps, 'variant' | 'size' | 'radius' | 'icon'> {
  variant?: ButtonVariant
  size?: ButtonSize
  radius?: ButtonRadius
  icon?: boolean
}

export function FieldButton({
  variant = 'ghost',
  size = 'xs',
  radius = '2xs',
  icon = true,
  className,
  children,
  ...props
}: FieldButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      radius={radius}
      icon={icon}
      className={pdClass(className, 'pd-field-button')}
      {...props}
    >
      {children}
    </Button>
  )
}
