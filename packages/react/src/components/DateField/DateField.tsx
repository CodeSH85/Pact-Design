import { useContext, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  ButtonContext,
  composeRenderProps,
  DateField as AriaDateField,
  DateFieldStateContext,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  DateSegment as AriaDateSegment,
  type DateSegmentProps as AriaDateSegmentProps,
  type DateValue
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import {
  resolveClearable,
  resolveDisableableProps,
  type ClearableProp,
  type DisableableProps,
  type FieldSharedProps,
  type ResolvedClearable
} from '../../utils/index.ts'
import {
  FieldButton,
  FieldDescription,
  FieldError,
  FieldGroup,
  type FieldSize,
  Label
} from '../Field/index.ts'

export interface DateFieldIcons {
  clear?: IconSlot
}

export type DateSegmentProps = AriaDateSegmentProps

export function DateSegment({ className, ...props }: DateSegmentProps) {
  return (
    <AriaDateSegment
      className={composeRenderProps(className, (cn) => clsx('pd-date-segment', cn))}
      {...props}
    />
  )
}

export interface DateInputProps extends Omit<AriaDateInputProps, 'children'> {
  children?: AriaDateInputProps['children']
}

export function DateInput({ className, children, ...props }: DateInputProps) {
  return (
    <AriaDateInput
      className={composeRenderProps(className, (cn) => clsx('pd-date-input', cn))}
      {...props}
    >
      {children ?? ((segment) => <DateSegment segment={segment} />)}
    </AriaDateInput>
  )
}

interface DateFieldClearButtonProps {
  isDisabled?: boolean
  isReadOnly?: boolean
  clearable: ResolvedClearable
  onClear?: () => void
  icons?: DateFieldIcons
}

function DateFieldClearButton({
  isDisabled,
  isReadOnly,
  clearable,
  onClear,
  icons
}: DateFieldClearButtonProps) {
  const state = useContext(DateFieldStateContext)
  if (!clearable.enabled || isDisabled || isReadOnly || state?.value == null) {
    return null
  }

  const handleClear = () => {
    state.setValue(null)
    onClear?.()
    clearable.onClear?.()
  }

  return (
    <ButtonContext.Provider value={null}>
      <FieldButton
        slot={null}
        className="pd-field-clear"
        aria-label={clearable.label}
        onPress={handleClear}
      >
        {renderIcon(clearable.icon ?? icons?.clear, 'clear', 'pd-field-icon')}
      </FieldButton>
    </ButtonContext.Provider>
  )
}

export interface DateFieldProps<T extends DateValue>
  extends Omit<AriaDateFieldProps<T>, 'children'>,
  FieldSharedProps,
  DisableableProps {
  size?: FieldSize
  clearable?: ClearableProp
  onClear?: () => void
  icons?: DateFieldIcons
  dateInputProps?: DateInputProps
  children?: ReactNode
}

export function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  size = 'md',
  clearable,
  onClear,
  icons,
  dateInputProps,
  className,
  children,
  ...props
}: DateFieldProps<T>) {
  const ariaProps = resolveDisableableProps(props)
  const resolvedClearable = resolveClearable(clearable, false)

  return (
    <AriaDateField
      className={composeRenderProps(className, (cn) => clsx('pd-field', cn))}
      {...ariaProps}
    >
      {label && <Label>{label}</Label>}

      {children ?? (
        <FieldGroup
          size={size}
          className={clsx(resolvedClearable.enabled && 'pd-field-group-compact-end')}
        >
          <DateInput {...dateInputProps} />
          <DateFieldClearButton
            isDisabled={ariaProps.isDisabled}
            isReadOnly={ariaProps.isReadOnly}
            clearable={resolvedClearable}
            onClear={onClear}
            icons={icons}
          />
        </FieldGroup>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaDateField>
  )
}

export default DateField
export type { DateValue }
