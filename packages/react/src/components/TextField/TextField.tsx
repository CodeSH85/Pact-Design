import { useRef, useState, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  ButtonContext,
  composeRenderProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import {
  resolveClearable,
  resolveDisableableProps,
  type ClearableProp,
  type DisableableProps,
  type FieldSharedProps
} from '../../utils/index.ts'
import {
  FieldButton,
  FieldDescription,
  FieldError,
  FieldGroup,
  type FieldSize,
  Input,
  type InputProps,
  Label
} from '../Field/index.ts'

export interface TextFieldIcons {
  clear?: IconSlot
}

export interface TextFieldProps
  extends Omit<AriaTextFieldProps, 'children'>,
  FieldSharedProps,
  DisableableProps {
  size?: FieldSize
  prefix?: ReactNode
  suffix?: ReactNode
  placeholder?: string
  clearable?: ClearableProp
  onClear?: () => void
  icons?: TextFieldIcons
  inputProps?: InputProps
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
  clearable,
  onClear,
  icons,
  inputProps,
  value,
  defaultValue,
  onChange,
  className,
  children,
  ...props
}: TextFieldProps) {
  const ariaProps = resolveDisableableProps(props)
  const resolvedClearable = resolveClearable(clearable, false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '')
  const currentValue = isControlled ? value : uncontrolledValue

  const handleChange = (nextValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue)
    }
    onChange?.(nextValue)
  }

  const handleClear = () => {
    handleChange('')
    onClear?.()
    resolvedClearable.onClear?.()
    inputRef.current?.focus()
  }

  const showClear =
    resolvedClearable.enabled &&
    !ariaProps.isDisabled &&
    !ariaProps.isReadOnly &&
    currentValue.length > 0

  const valueBindingProps = resolvedClearable.enabled
    ? { value: currentValue, onChange: handleChange }
    : { value, defaultValue, onChange }

  return (
    <AriaTextField
      className={composeRenderProps(className, (cn) => clsx('pd-field', cn))}
      {...valueBindingProps}
      {...ariaProps}
    >
      {label && <Label>{label}</Label>}

      {children ?? (
        <FieldGroup
          size={size}
          className={clsx(showClear && !suffix && 'pd-field-group-compact-end')}
        >
          {prefix && <span className="pd-field-affix">{prefix}</span>}
          <Input ref={inputRef} placeholder={placeholder} {...inputProps} />
          {showClear && (
            <ButtonContext.Provider value={null}>
              <FieldButton
                slot={null}
                className="pd-field-clear"
                aria-label={resolvedClearable.label}
                onPress={handleClear}
              >
                {renderIcon(resolvedClearable.icon ?? icons?.clear, 'clear', 'pd-field-icon')}
              </FieldButton>
            </ButtonContext.Provider>
          )}
          {suffix && <span className="pd-field-affix">{suffix}</span>}
        </FieldGroup>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  )
}

export default TextField
