import { useRef, useState, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps
} from 'react-aria-components'
import { type IconSlot } from '../../icons/index.ts'
import { FieldChrome, FieldClearButton, pdClass } from '../../internal/index.ts'
import {
  resolveClearable,
  resolveDisableableProps,
  type ClearableProp,
  type DisableableProps,
  type FieldSharedProps
} from '../../utils/index.ts'
import {
  FieldGroup,
  type FieldSize,
  Input,
  type InputProps
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
      className={pdClass(className, 'pd-field')}
      {...valueBindingProps}
      {...ariaProps}
    >
      <FieldChrome label={label} description={description} errorMessage={errorMessage}>
        {children ?? (
          <FieldGroup
            size={size}
            className={clsx(showClear && !suffix && 'pd-field-group-compact-end')}
          >
            {prefix && <span className="pd-field-affix">{prefix}</span>}
            <Input ref={inputRef} placeholder={placeholder} {...inputProps} />
            {showClear && (
              <FieldClearButton
                clearable={resolvedClearable}
                fallbackIcon={icons?.clear}
                onPress={handleClear}
              />
            )}
            {suffix && <span className="pd-field-affix">{suffix}</span>}
          </FieldGroup>
        )}
      </FieldChrome>
    </AriaTextField>
  )
}

export default TextField
