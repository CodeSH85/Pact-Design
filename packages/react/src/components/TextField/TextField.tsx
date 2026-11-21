import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  type InputProps as AriaInputProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps
} from 'react-aria-components'
import { type FieldSharedProps } from '../../utils/index.ts'
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  type FieldSize,
  Input,
  Label
} from '../Field/index.ts'

export interface TextFieldProps
  extends Omit<AriaTextFieldProps, 'children'>,
  FieldSharedProps {
  size?: FieldSize
  prefix?: ReactNode
  suffix?: ReactNode
  placeholder?: string
  inputProps?: AriaInputProps
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
      className={composeRenderProps(className, (cn) => clsx('pd-field', cn))}
      {...props}
    >
      {label && <Label>{label}</Label>}

      {children ?? (
        <FieldGroup size={size}>
          {prefix && <span className="pd-field-affix">{prefix}</span>}
          <Input placeholder={placeholder} {...inputProps} />
          {suffix && <span className="pd-field-affix">{suffix}</span>}
        </FieldGroup>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  )
}

export default TextField
