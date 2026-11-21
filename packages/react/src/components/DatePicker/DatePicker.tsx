import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { RiCalendarLine } from '@remixicon/react'
import { type FieldSharedProps } from '../../utils/index.ts'
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  type CalendarCellProps,
  type CalendarProps
} from '../Calendar/index.ts'
import { DateInput, type DateInputProps } from '../DateField/index.ts'
import { Dialog } from '../Dialog/index.ts'
import {
  FieldButton,
  FieldDescription,
  FieldError,
  FieldGroup,
  type FieldSize,
  Label
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
  type CalendarProps
}

export type DatePickerPopoverProps = AriaPopoverProps

export interface DatePickerProps<T extends DateValue>
  extends Omit<AriaDatePickerProps<T>, 'children'>,
  FieldSharedProps {
  size?: FieldSize
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
  dateInputProps,
  popoverProps,
  calendarProps,
  className,
  children,
  ...props
}: DatePickerProps<T>) {
  return (
    <AriaDatePicker
      className={composeRenderProps(className, (cn) => clsx('pd-field', cn))}
      {...props}
    >
      {label && <Label>{label}</Label>}

      {children ?? (
        <>
          <FieldGroup size={size} className="pd-field-group-compact-end pd-field-group-between">
            <DateInput {...dateInputProps} />
            <FieldButton aria-label="Open calendar">
              <RiCalendarLine className="pd-field-icon" aria-hidden="true" />
            </FieldButton>
          </FieldGroup>

          <PopoverContent placement="bottom start" {...popoverProps}>
            <Dialog className="pd-date-picker-dialog">
              <Calendar {...calendarProps} />
            </Dialog>
          </PopoverContent>
        </>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaDatePicker>
  )
}

export default DatePicker
export type { DateValue }
