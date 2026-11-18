import { type ReactNode } from 'react'
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { RiCalendarLine } from '@remixicon/react'
import { type VariantProps } from 'class-variance-authority'
import {
  composeTailwindRenderProps,
  fieldWrapperClasses,
  type FieldSharedProps
} from '../../utils/index.ts'
import {
  Calendar,
  CalendarCell,
  calendarCellClasses,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  calendarNavButtonClasses,
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
  fieldGroupVariants,
  Label
} from '../Field/index.ts'
import { PopoverContent } from '../Popover/index.ts'

export {
  Calendar,
  CalendarCell,
  calendarCellClasses,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  calendarNavButtonClasses,
  type CalendarCellProps,
  type CalendarProps
}

export interface DatePickerPopoverProps extends AriaPopoverProps {
  className?: string
}

export interface DatePickerProps<T extends DateValue>
  extends AriaDatePickerProps<T>,
  VariantProps<typeof fieldGroupVariants>,
  FieldSharedProps {
  dateInputProps?: DateInputProps
  popoverProps?: DatePickerPopoverProps
  calendarProps?: Partial<CalendarProps<T>>
  className?: string
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
      className={composeTailwindRenderProps(className, fieldWrapperClasses)}
      {...props}
    >
      {label && <Label>{label}</Label>}

      {children ?? (
        <>
          <FieldGroup size={size} className="pr-2xs justify-between">
            <DateInput {...dateInputProps} />
            <FieldButton aria-label="Open calendar">
              <RiCalendarLine className="w-icon-xs h-icon-xs" aria-hidden="true" />
            </FieldButton>
          </FieldGroup>

          <PopoverContent placement="bottom start" {...popoverProps}>
            <Dialog className="p-xs">
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
