import { type ReactNode } from 'react'
import {
  Input as AriaInput,
  type InputProps as AriaInputProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps
} from 'react-aria-components'
import { type VariantProps } from 'class-variance-authority'
import { composeTailwindRenderProps } from '../../utils/index.ts'
import { FieldDescription, FieldError, FieldGroup, fieldGroupVariants, Label } from '../Field/index.ts'

export interface TextFieldProps
  extends AriaTextFieldProps,
  VariantProps<typeof fieldGroupVariants> {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
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
      className={composeTailwindRenderProps(className, 'flex flex-col gap-xs w-full')}
      {...props}
    >
      {label && <Label>{label}</Label>}

      {children ?? (
        <FieldGroup size={size}>
          {prefix && <span className="inline-flex items-center text-on-surface-muted shrink-0">{prefix}</span>}
          <AriaInput
            placeholder={placeholder}
            className="w-full bg-transparent border-0 outline-none p-0 text-inherit placeholder:text-on-surface-disabled"
            {...inputProps}
          />
          {suffix && <span className="inline-flex items-center text-on-surface-muted shrink-0">{suffix}</span>}
        </FieldGroup>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaTextField>
  )
}

export default TextField
