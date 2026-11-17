import { type ReactNode } from 'react'
import {
  Button as AriaButton,
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  type CalendarCellProps as AriaCalendarCellProps,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  type CalendarGridBodyProps as AriaCalendarGridBodyProps,
  CalendarGridHeader as AriaCalendarGridHeader,
  type CalendarGridHeaderProps as AriaCalendarGridHeaderProps,
  type CalendarGridProps as AriaCalendarGridProps,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  type CalendarHeaderCellProps as AriaCalendarHeaderCellProps,
  CalendarHeading as AriaCalendarHeading,
  type CalendarHeadingProps as AriaCalendarHeadingProps,
  type CalendarProps as AriaCalendarProps,
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
  Dialog as AriaDialog,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { RiArrowLeftSLine, RiArrowRightSLine, RiCalendarLine } from '@remixicon/react'
import { type VariantProps } from 'class-variance-authority'
import { cn, composeTailwindRenderProps, focusRing } from '../../utils/index.ts'
import { DateInput, type DateInputProps } from '../DateField/index.ts'
import { FieldDescription, FieldError, FieldGroup, fieldGroupVariants, Label } from '../Field/index.ts'
import { popoverContentClasses } from '../Popover/index.ts'

export const calendarCellClasses = [
  'inline-flex items-center justify-center w-control-sm h-control-sm rounded-xs',
  'text-label-sm tabular-nums select-none cursor-pointer outline-none transition-colors duration-fast',
  focusRing,
  'hover:bg-layer-2-hover data-[hovered]:bg-layer-2-hover',
  'data-[today]:font-semibold data-[today]:border data-[today]:border-border-strong',
  'data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:hover:bg-primary-hover',
  'data-[invalid]:data-[selected]:bg-danger data-[invalid]:data-[selected]:text-on-danger',
  'data-[outside-month]:text-on-surface-disabled data-[outside-month]:pointer-events-none',
  'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
  'data-[unavailable]:text-on-surface-disabled data-[unavailable]:line-through data-[unavailable]:cursor-not-allowed'
].join(' ')

export const calendarNavButtonClasses = [
  'inline-flex items-center justify-center w-control-xs h-control-xs rounded-xs',
  'text-on-surface-secondary hover:text-on-surface hover:bg-layer-2-hover cursor-pointer',
  'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed',
  focusRing
].join(' ')

export interface CalendarCellProps extends AriaCalendarCellProps {
  className?: string
}

export function CalendarCell({ className, ...props }: CalendarCellProps) {
  return (
    <AriaCalendarCell
      className={composeTailwindRenderProps(className, calendarCellClasses)}
      {...props}
    />
  )
}

export function CalendarHeading({ className, ...props }: AriaCalendarHeadingProps) {
  return (
    <AriaCalendarHeading
      className={cn('text-label-md font-semibold text-on-surface m-0', className)}
      {...props}
    />
  )
}

export function CalendarHeaderCell({ className, ...props }: AriaCalendarHeaderCellProps) {
  return (
    <AriaCalendarHeaderCell
      className={cn('text-caption-sm font-medium text-on-surface-muted pb-xs w-control-sm text-center', className)}
      {...props}
    />
  )
}

export function CalendarGridHeader({ className, children, ...props }: AriaCalendarGridHeaderProps) {
  return (
    <AriaCalendarGridHeader className={cn(className)} {...props}>
      {children}
    </AriaCalendarGridHeader>
  )
}

export function CalendarGridBody({ className, children, ...props }: AriaCalendarGridBodyProps) {
  return (
    <AriaCalendarGridBody className={cn(className)} {...props}>
      {children}
    </AriaCalendarGridBody>
  )
}

export function CalendarGrid({ className, children, ...props }: AriaCalendarGridProps) {
  return (
    <AriaCalendarGrid className={cn('border-collapse', className)} {...props}>
      {children ?? (
        <>
          <CalendarGridHeader>
            {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} />}
          </CalendarGridBody>
        </>
      )}
    </AriaCalendarGrid>
  )
}

export interface CalendarProps<T extends DateValue> extends AriaCalendarProps<T> {
  className?: string
  children?: ReactNode
}

export function Calendar<T extends DateValue>({
  className,
  children,
  ...props
}: CalendarProps<T>) {
  return (
    <AriaCalendar
      className={composeTailwindRenderProps(className, 'flex flex-col gap-sm w-fit select-none')}
      {...props}
    >
      {children ?? (
        <>
          <header className="flex items-center justify-between gap-xs">
            <AriaButton slot="previous" className={calendarNavButtonClasses}>
              <RiArrowLeftSLine className="w-icon-sm h-icon-sm" aria-hidden="true" />
            </AriaButton>
            <CalendarHeading />
            <AriaButton slot="next" className={calendarNavButtonClasses}>
              <RiArrowRightSLine className="w-icon-sm h-icon-sm" aria-hidden="true" />
            </AriaButton>
          </header>
          <CalendarGrid />
        </>
      )}
    </AriaCalendar>
  )
}

export interface DatePickerPopoverProps extends AriaPopoverProps {
  className?: string
}

export interface DatePickerProps<T extends DateValue>
  extends AriaDatePickerProps<T>,
  VariantProps<typeof fieldGroupVariants> {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
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
      className={composeTailwindRenderProps(className, 'relative flex flex-col gap-xs w-full')}
      {...props}
    >
      {label && <Label>{label}</Label>}

      {children ?? (
        <>
          <FieldGroup size={size} className="pr-2xs justify-between">
            <DateInput {...dateInputProps} />
            <AriaButton
              aria-label="Open calendar"
              className="inline-flex items-center justify-center p-3xs rounded-2xs text-on-surface-muted hover:text-on-surface cursor-pointer outline-none"
            >
              <RiCalendarLine className="w-icon-xs h-icon-xs" aria-hidden="true" />
            </AriaButton>
          </FieldGroup>

          <AriaPopover
            offset={6}
            placement="bottom start"
            className={composeTailwindRenderProps(popoverProps?.className, popoverContentClasses)}
            {...popoverProps}
          >
            <AriaDialog className="outline-none p-xs">
              <Calendar {...calendarProps} />
            </AriaDialog>
          </AriaPopover>
        </>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaDatePicker>
  )
}

export default DatePicker
export type { DateValue }
