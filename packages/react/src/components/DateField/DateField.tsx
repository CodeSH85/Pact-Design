import { useContext, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  DateField as AriaDateField,
  DateFieldStateContext,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  DateSegment as AriaDateSegment,
  type DateSegmentProps as AriaDateSegmentProps,
  type DateValue
} from 'react-aria-components'
import { type IconSlot } from '../../icons/index.ts'
import { FieldChrome, FieldClearButton, pdClass } from '../../internal/index.ts'
import {
  resolveClearable,
  resolveDisableableProps,
  type ClearableProp,
  type DisableableProps,
  type FieldSharedProps,
  type ResolvedClearable
} from '../../utils/index.ts'
import {
  FieldGroup,
  type FieldSize
} from '../Field/index.ts'

export interface DateFieldIcons {
  clear?: IconSlot
}

export type DateSegmentProps = AriaDateSegmentProps

export function DateSegment({ className, ...props }: DateSegmentProps) {
  return (
    <AriaDateSegment
      className={pdClass(className, 'pd-date-segment')}
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
      className={pdClass(className, 'pd-date-input')}
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
    <FieldClearButton
      clearable={clearable}
      fallbackIcon={icons?.clear}
      onPress={handleClear}
    />
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
      className={pdClass(className, 'pd-field')}
      {...ariaProps}
    >
      <FieldChrome label={label} description={description} errorMessage={errorMessage}>
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
      </FieldChrome>
    </AriaDateField>
  )
}

export default DateField
export type { DateValue }
