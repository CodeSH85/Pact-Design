import { type ReactNode } from 'react'
import {
  type InputProps as AriaInputProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps
} from 'react-aria-components'
import { type VariantProps } from 'class-variance-authority'
import {
  composeTailwindRenderProps,
  fieldWrapperClasses,
  type FieldSharedProps
} from '../../utils/index.ts'
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  fieldGroupVariants,
  Input,
  Label
} from '../Field/index.ts'

export interface TextFieldProps
  extends AriaTextFieldProps,
  VariantProps<typeof fieldGroupVariants>,
  FieldSharedProps {
  prefix?: ReactNode
  suffix?: ReactNode
  placeholder?: string
  inputProps?: AriaInputProps
  className?: string
  children?: ReactNode
}

export function TextField({
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  placeholder,
  size = 'md',
  inputProps,
  className,
  children,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField
      className={composeTailwindRenderProps(className, fieldWrapperClasses)}
      {...props}
    >
      {label && <Label>{label}</Label>}

      {children ?? (
        <FieldGroup size={size}>
          {prefix && <span className="inline-flex items-center text-field-text-muted shrink-0">{prefix}</span>}
          <Input placeholder={placeholder} {...inputProps} />
          {suffix && <span className="inline-flex items-center text-field-text-muted shrink-0">{suffix}</span>}
        </FieldGroup>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  )
}

export default TextField
