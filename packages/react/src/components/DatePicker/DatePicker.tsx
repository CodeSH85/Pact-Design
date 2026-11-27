import { useContext, type MouseEvent, type ReactNode } from 'react'
import {
  DatePicker as AriaDatePicker,
  DatePickerStateContext,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import { Dialog } from '../../internal/Dialog/index.ts'
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
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  type CalendarCellProps,
  type CalendarIcons,
  type CalendarProps
} from '../Calendar/index.ts'
import { DateInput, type DateInputProps } from '../DateField/index.ts'
import {
  FieldButton,
  FieldGroup,
  type FieldSize
} from '../Field/index.ts'
import { PopoverContent } from '../Popover/index.ts'

export {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  type CalendarCellProps,
  type CalendarIcons,
  type CalendarProps
}

export interface DatePickerIcons {
  calendar?: IconSlot
  clear?: IconSlot
}

export type DatePickerPopoverProps = AriaPopoverProps

interface DatePickerControlProps {
  size: FieldSize
  isDisabled?: boolean
  isReadOnly?: boolean
  clearable: ResolvedClearable
  onClear?: () => void
  icons?: DatePickerIcons
  dateInputProps?: DateInputProps
}

function DatePickerControl({
  size,
  isDisabled,
  isReadOnly,
  clearable,
  onClear,
  icons,
  dateInputProps
}: DatePickerControlProps) {
  const state = useContext(DatePickerStateContext)
  const showClear = clearable.enabled && !isDisabled && !isReadOnly && state?.value != null

  const handleGroupClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isDisabled || isReadOnly || !state) return
    const target = event.target as HTMLElement | null
    if (target?.closest('.pd-date-segment') || target?.closest('button')) return

    if (!state.isOpen) {
      state.open()
    }
  }

  const handleClear = () => {
    if (!state) return
    state.setValue(null)
    onClear?.()
    clearable.onClear?.()
  }

  return (
    <FieldGroup
      size={size}
      isDisabled={isDisabled}
      className="pd-field-group-compact-end pd-field-group-between"
      onClick={handleGroupClick}
    >
      <DateInput {...dateInputProps} />
      <span className="pd-field-actions">
        {showClear && (
          <FieldClearButton
            clearable={clearable}
            fallbackIcon={icons?.clear}
            onPress={handleClear}
          />
        )}
        <FieldButton aria-label="Open calendar">
          {renderIcon(icons?.calendar, 'calendar', 'pd-field-icon')}
        </FieldButton>
      </span>
    </FieldGroup>
  )
}

export interface DatePickerProps<T extends DateValue>
  extends Omit<AriaDatePickerProps<T>, 'children'>,
  FieldSharedProps,
  DisableableProps {
  size?: FieldSize
  clearable?: ClearableProp
  onClear?: () => void
  icons?: DatePickerIcons
  dateInputProps?: DateInputProps
  popoverProps?: DatePickerPopoverProps
  calendarProps?: Partial<CalendarProps<T>>
  children?: ReactNode
}

export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  size = 'md',
  clearable,
  onClear,
  icons,
  dateInputProps,
  popoverProps,
  calendarProps,
  className,
  children,
  ...props
}: DatePickerProps<T>) {
  const ariaProps = resolveDisableableProps(props)
  const resolvedClearable = resolveClearable(clearable, false)

  return (
    <AriaDatePicker
      className={pdClass(className, 'pd-field')}
      {...ariaProps}
    >
      <FieldChrome label={label} description={description} errorMessage={errorMessage}>
        {children ?? (
          <>
            <DatePickerControl
              size={size}
              isDisabled={ariaProps.isDisabled}
              isReadOnly={ariaProps.isReadOnly}
              clearable={resolvedClearable}
              onClear={onClear}
              icons={icons}
              dateInputProps={dateInputProps}
            />

            <PopoverContent placement="bottom start" {...popoverProps}>
              <Dialog className="pd-date-picker-dialog">
                <Calendar {...calendarProps} />
              </Dialog>
            </PopoverContent>
          </>
        )}
      </FieldChrome>
    </AriaDatePicker>
  )
}

export default DatePicker
export type { DateValue }
